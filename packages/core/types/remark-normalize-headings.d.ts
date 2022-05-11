declare module 'remark-normalize-headings' {
  import { Node } from 'unist';

  export default function (): (ast: Node) => void;
}
