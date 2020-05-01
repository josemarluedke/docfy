import path from 'path';
import getRepoInfo from 'git-repo-info';
import GitHost, { fromUrl } from 'hosted-git-info';

function getTreePath(
  repo: GitHost | undefined,
  branch: string,
  relative: string
): string {
  if (repo && repo.type === 'bitbucket') {
    const querystring = `?mode=edit&spa=0&at=${branch}&fileviewer=file-view-default`;
    const filepath = path.join('/', 'src', branch, relative, `{filepath}`);
    return `${filepath}${querystring}`;
  }

  return path.join('/', 'edit', branch, relative, `{filepath}`);
}

const repoEditUrlMap = new Map();

export function getRepoEditUrl(
  root: string,
  repoURL: string,
  branch = 'master'
): string | null {
  const key = [root, repoURL, branch].join('');

  if (repoEditUrlMap.has(key)) {
    return repoEditUrlMap.get(key);
  }

  let result: string | null = null;

  try {
    const gitRoot = getRepoInfo(root).root;
    const repo = fromUrl(repoURL);
    const relative = path.relative(gitRoot, root);
    const tree = getTreePath(repo, branch, relative);

    result =
      (repo &&
        repo.browsetemplate &&
        repo.browsetemplate
          .replace('{domain}', repo.domain)
          .replace('{user}', repo.user)
          .replace('{project}', repo.project)
          .replace('{/tree/committish}', tree)) ||
      null;
  } catch (err) {
    console.error(err);
    result = null;
  }

  repoEditUrlMap.set(key, result);
  return result;
}
