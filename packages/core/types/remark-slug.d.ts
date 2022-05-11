declare module 'remark-slug' {
  import { Node } from 'unist';

  export default function (): (ast: Node) => void;
}
