import fs from 'fs';
import path from 'path';
import getRepoInfo from 'git-repo-info';
import GitHost from 'hosted-git-info';

/**
 * Resolves the top level of the checkout that `target` lives in.
 *
 * `git-repo-info` documents that its `root` points at the original copy rather
 * than the worktree when called from inside a linked worktree. Using it
 * directly makes the relative path below include the worktree's own location,
 * producing edit URLs for paths that do not exist on the remote.
 *
 * A worktree's metadata directory holds a `gitdir` file pointing at that
 * worktree's `.git` file, and its parent is the top level we want. Outside a
 * worktree `worktreeGitDir` and `commonGitDir` are the same, so there is
 * nothing to correct.
 */
function getCheckoutRoot(target: string): string {
  const { root, commonGitDir, worktreeGitDir } = getRepoInfo(target);

  if (!worktreeGitDir || worktreeGitDir === commonGitDir) {
    return root;
  }

  try {
    const gitdir = fs.readFileSync(path.join(worktreeGitDir, 'gitdir'), 'utf8').trim();

    if (gitdir) {
      return path.dirname(gitdir);
    }
  } catch {
    // No readable `gitdir` pointer, so fall back to the reported root.
  }

  return root;
}

// A whitelist, not a fallback: `getTreePath` only knows two URL shapes, Bitbucket's
// and the `/edit/` form GitHub and GitLab accept. Every other host hosted-git-info can
// parse (gist, sourcehut, anything a future release adds) would otherwise be handed a
// plausible looking but wrong URL, and no edit link beats a broken one.
const supportedHostTypes = ['github', 'gitlab', 'bitbucket'];

function getTreePath(repo: GitHost | undefined, branch: string, relative: string): string {
  if (repo && repo.type === 'bitbucket') {
    const querystring = `?mode=edit&spa=0&at=${branch}&fileviewer=file-view-default`;
    const filepath = path.join('/', 'src', branch, relative, `{filepath}`);
    return `${filepath}${querystring}`;
  }

  return path.join('/', 'edit', branch, relative, `{filepath}`);
}

const repoEditUrlMap = new Map();

export function getRepoEditUrl(root: string, repoURL: string, branch = 'master'): string | null {
  const key = [root, repoURL, branch].join('');

  if (repoEditUrlMap.has(key)) {
    return repoEditUrlMap.get(key) as string;
  }

  let result: string | null = null;

  try {
    const gitRoot = getCheckoutRoot(root);
    const repo = GitHost.fromUrl(repoURL);
    const relative = path.relative(gitRoot, root);
    const tree = getTreePath(repo, branch, relative);

    // The host's own `edit`/`browse` helpers percent-encode the path, which would
    // mangle the `{filepath}` placeholder Docfy substitutes later on, so the URL is
    // assembled from the parsed host metadata instead.
    result =
      repo && supportedHostTypes.includes(repo.type)
        ? `https://${repo.domain}/${repo.user}/${repo.project}${tree}`
        : null;
  } catch (err) {
    console.error(err);
    result = null;
  }

  repoEditUrlMap.set(key, result);
  return result;
}
