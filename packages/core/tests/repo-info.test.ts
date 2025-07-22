import { getRepoEditUrl } from '../src/-private/repo-info';

test('gets edit url from github with default branch', () => {
  expect(getRepoEditUrl(__dirname, 'https://github.com/user/repo')).toBe(
    'https://github.com/user/repo/edit/master/packages/core/tests/{filepath}'
  );
});

test('gets edit url from github with custom branch', () => {
  expect(getRepoEditUrl(__dirname, 'https://github.com/user/repo', 'my-branch')).toBe(
    'https://github.com/user/repo/edit/my-branch/packages/core/tests/{filepath}'
  );
});

test('gets edit url from bitbucket with default branch', () => {
  expect(getRepoEditUrl(__dirname, 'https://bitbucket.org/user/repo')).toBe(
    'https://bitbucket.org/user/repo/src/master/packages/core/tests/{filepath}?mode=edit&spa=0&at=master&fileviewer=file-view-default'
  );
});

test('gets edit url from bitbucket with custom branch', () => {
  expect(getRepoEditUrl(__dirname, 'https://bitbucket.org/user/repo', 'my-branch')).toBe(
    'https://bitbucket.org/user/repo/src/my-branch/packages/core/tests/{filepath}?mode=edit&spa=0&at=my-branch&fileviewer=file-view-default'
  );
});
