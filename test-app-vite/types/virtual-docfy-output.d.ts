declare module 'virtual:docfy-output' {
  import type { NestedPageMetadata } from '@docfy/core/lib/types';
  const output: { nested: NestedPageMetadata };
  export default output;
}
