declare module 'remark-autolink-headings' {
  import { Node } from 'unist';

  export default function (): (ast: Node) => void;
}
