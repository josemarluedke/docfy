declare module 'rehype-raw' {
  import { Node } from 'unist';

  export default function (): (ast: Node) => void;
}
