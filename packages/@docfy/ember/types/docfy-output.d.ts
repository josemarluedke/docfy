import { Page } from '@docfy/core/dist/types';
declare module '@docfy/output' {
  // eslint-disable-next-line
  export interface OutputPage
    extends Pick<Page, 'url' | 'headings' | 'title' | 'source' | 'metadata'> {}
  const output: OutputPage[];

  export default output;
}
