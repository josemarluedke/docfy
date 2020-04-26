import { Page } from '@docfy/core/dist/types';
declare module '@docfy/output' {
  const output: Pick<
    Page,
    'url' | 'headings' | 'title' | 'source' | 'metadata'
  >[];

  export default output;
}
