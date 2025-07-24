declare module 'virtual:docfy/output' {
  /*
   * The actual output.js file is generated at build time. This is only to
   * provide typing.
   */
  import type { NestedPageMetadata } from '@docfy/core/lib/types';

  interface Output {
    nested: NestedPageMetadata;
  }

  declare const output: Output;

  export default output;
}
