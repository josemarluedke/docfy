declare module 'mdast-util-to-string' {
  import { Node } from 'unist';

  export default function (ast: Node): string;
}
