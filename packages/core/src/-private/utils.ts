import path from 'path';
import visit from 'unist-util-visit';
import { Node } from 'unist';
import toString from 'mdast-util-to-string';
import Slugger from 'github-slugger';
import YAML from 'yaml';
import url from 'url';

const slug = Slugger.slug;

function clearURL(parts: string[], suffix: string): string {
  const url = parts
    .map((item) => {
      return item
        .toLowerCase()
        .replace(/(\._)|(\.)/g, '-')
        .replace(/_$/, '');
    })
    .join('/');

  return `${url}${suffix}`;
}

export function generateManualUrl(
  source: string,
  meta: Record<string, unknown>,
  prefix?: string,
  suffix?: string
): string {
  let ignoreSuffix = false;
  const parts: string[] = [''];
  if (prefix) {
    parts.push(prefix);
  }
  if (typeof meta.category === 'string') {
    parts.push(slug(meta.category));
  }
  if (typeof meta.subcategory === 'string') {
    parts.push(slug(meta.subcategory));
  }

  let fileName = path.parse(path.basename(source)).name.toLowerCase();
  if (fileName === 'index' || fileName === 'readme') {
    fileName = path.basename(path.dirname(source));
    if (fileName === '.') {
      parts.push('');
    } else {
      parts.push(fileName, '');
    }
    ignoreSuffix = true;
  } else {
    parts.push(fileName);
  }

  return clearURL(parts, ignoreSuffix ? '' : suffix || '');
}

export function generateAutoUrl(
  source: string,
  prefix?: string,
  suffix?: string
): string {
  let ignoreSuffix = false;
  source = source.replace(/^\//, '');
  const parts: string[] = [''];
  if (prefix) {
    parts.push(prefix);
  }
  parts.push(...source.split(path.sep));

  let fileName = path.parse(parts.pop() as string).name.toLowerCase();
  if (fileName === 'index' || fileName === 'readme') {
    fileName = path.basename(path.dirname(source));
    parts.push('');
    ignoreSuffix = true;
  } else {
    parts.push(fileName);
  }

  return clearURL(parts, ignoreSuffix ? '' : suffix || '');
}

export function inferTitle(ast: Node): string | undefined {
  let docTitle: string | undefined;
  visit(ast, 'heading', (node) => {
    const { depth } = node;
    if (depth !== 1) return;
    docTitle = toString(node);
  });
  return docTitle;
}

export function isValidUrl(s: string): boolean {
  try {
    new url.URL(s);
    return true;
  } catch {
    return false;
  }
}

export function isAnchorUrl(s: string): boolean {
  return s[0] === '#';
}

/*
 * Delete a node from a list of nodes
 */
export function deleteNode(
  nodes: unknown,
  nodeToDelete: Node | undefined
): void {
  if (!nodeToDelete) {
    return;
  }

  if (Array.isArray(nodes)) {
    const index = nodes.findIndex((item) => item === nodeToDelete);

    if (index !== -1) {
      nodes.splice(index, 1);
    }
  }
}

export const DEFAULT_IGNORE = [
  '/**/node_modules/**',
  '/**/.git/**',
  '/**/dist/**',
  'node_modules/**',
  '.git/**',
  'dist/**'
];
