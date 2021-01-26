declare module 'remark-html' {
  import { Node } from 'unist';

  export default function (): (ast: Node) => void;
}
