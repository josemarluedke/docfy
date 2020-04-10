declare module 'remark-hbs' {
  import { Node } from 'unist';

  export default function (): (ast: Node) => void;
}
