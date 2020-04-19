declare module 'remark-frontmatter' {
  import { Node } from 'unist';

  interface OpenClose {
    open: string;
    close: string;
  }

  interface Options {
    type: string;
    marker?: string | OpenClose;
    fence?: string | OpenClose;
    anywhere?: boolean;
  }

  export default function (options: string[] | Options[]): (ast: Node) => void;
}
