/**
 * Minimal typings for the `hosted-git-info` members Docfy actually uses.
 *
 * The package ships no types of its own, and DefinitelyTyped's
 * `@types/hosted-git-info` stopped at 3.0.5 — it was never updated for v4+, so
 * it is now four majors behind and wrong in ways that matter: it declares the
 * `*template` members as strings when they have been functions since v4, and
 * its `Hosts` union does not know about hosts the current version parses.
 *
 * Declaring only what `repo-info.ts` consumes keeps the contract honest and
 * small. None of this leaks into Docfy's public API — `getRepoEditUrl` returns
 * `string | null`.
 */
declare module 'hosted-git-info' {
  class GitHost {
    /**
     * Short host name. The current version reports `github`, `gitlab`,
     * `bitbucket`, `gist` or `sourcehut`.
     */
    type: string;
    domain: string;
    user: string;
    project: string;

    static fromUrl(gitUrl: string, options?: Record<string, unknown>): GitHost | undefined;
  }

  export = GitHost;
}
