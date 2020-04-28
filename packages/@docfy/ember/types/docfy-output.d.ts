import { PageContent } from '@docfy/core/dist/types';
declare module '@docfy/output' {
  // eslint-disable-next-line
  export interface OutputPage
    extends Pick<
      PageContent,
      'url' | 'headings' | 'title' | 'source' | 'metadata'
    > {}
  const output: OutputPage[];

  export default output;
}
