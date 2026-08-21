import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync } from 'child_process';
import { getRepoEditUrl } from '../src/-private/repo-info.js';

/**
 * `git-repo-info` reports the *original* checkout's root when called from
 * inside a linked worktree, which used to leak the worktree's own location into
 * every edit URL. CI runs in a normal checkout, so without this test that
 * regression would be invisible there.
 */
describe('getRepoEditUrl in a git worktree', () => {
  // realpath matters: on macOS os.tmpdir() is a symlink and git records the
  // resolved path, so comparing against the unresolved one would break.
  const tmp = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'docfy-worktree-')));
  const mainCheckout = path.join(tmp, 'main');
  const worktree = path.join(tmp, 'linked');
  const expected = 'https://github.com/user/repo/edit/main/docs/{filepath}';

  beforeAll(() => {
    const git = (...args: string[]): void => {
      execFileSync('git', args, { cwd: mainCheckout, stdio: 'pipe' });
    };

    fs.mkdirSync(path.join(mainCheckout, 'docs'), { recursive: true });
    git('init', '-b', 'main');
    git('config', 'user.email', 'test@example.com');
    git('config', 'user.name', 'Docfy Test');
    fs.writeFileSync(path.join(mainCheckout, 'docs', 'index.md'), '# Hello\n');
    git('add', '.');
    git('commit', '-m', 'init');
    git('worktree', 'add', worktree, '-b', 'feature');
  });

  afterAll(() => {
    fs.rmSync(tmp, { recursive: true, force: true });
  });

  test('the edit url does not include the worktree location', () => {
    expect(
      getRepoEditUrl(path.join(worktree, 'docs'), 'https://github.com/user/repo', 'main')
    ).toBe(expected);
  });

  test('the same source path resolves identically in the main checkout', () => {
    expect(
      getRepoEditUrl(path.join(mainCheckout, 'docs'), 'https://github.com/user/repo', 'main')
    ).toBe(expected);
  });
});
