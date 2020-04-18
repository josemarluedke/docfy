import path from 'path';
import visit from 'unist-util-visit';
import { Node } from 'unist';
import { Content } from './types';
import toString from 'mdast-util-to-string';
import Slugger from 'github-slugger';

const slug = Slugger.slug;

export function generateUrl(source: string, meta: Content['metadata']): string {
  const parts: string[] = [];
  if (meta.package) {
    parts.push(slug(meta.package));
  }
  if (meta.category) {
    parts.push(slug(meta.category));
  }
  let file = path.parse(path.basename(source));
  if (file.name === 'index') {
    file = path.parse(path.basename(path.dirname(source)));
  }
  parts.push(file.name);
  return parts.join('/');
}

export function getTitlteFomMarkdown(ast: Node): string | undefined {
  let docTitle: string | undefined;
  visit(ast, 'heading', (node) => {
    const { depth } = node;
    if (depth !== 1) return;
    docTitle = toString(node);
  });
  return docTitle;
}
