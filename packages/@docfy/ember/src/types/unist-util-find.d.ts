declare module 'unist-util-find' {
  import { Node } from 'unist';

  export default function (
    ast: Node,
    condition: string | Record<string, unknown> | ((node: Node) => boolean)
  ): Node | undefined;
}
