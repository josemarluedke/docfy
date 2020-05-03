import path from 'path';
import visit from 'unist-util-visit';
import { Node } from 'unist';
import toString from 'mdast-util-to-string';
import Slugger from 'github-slugger';
import YAML from 'yaml';
import url from 'url';

const slug = Slugger.slug;

export function generateManualUrl(
  source: string,
  meta: Record<string, unknown>,
  prefix?: string,
  suffix?: string
): string {
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
  } else {
    parts.push(`${fileName}${suffix || ''}`);
  }

  return parts.join('/').toLowerCase();
}

export function generateAutoUrl(
  source: string,
  prefix?: string,
  suffix?: string
): string {
  const parts: string[] = [''];
  if (prefix) {
    parts.push(prefix);
  }
  parts.push(...source.split(path.sep));

  let fileName = path.parse(parts.pop() as string).name.toLowerCase();
  if (fileName === 'index' || fileName === 'readme') {
    fileName = path.basename(path.dirname(source));
    parts.push('');
  } else {
    parts.push(`${fileName}${suffix || ''}`);
  }

  return parts.join('/').toLowerCase();
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

export function parseFrontmatter(
  source: string,
  ast: Node
): Record<string, undefined> {
  let result = {};
  visit(ast, 'yaml', (node) => {
    try {
      result = YAML.parse(node.value as string);
    } catch (e) {
      console.error(`Error while parsing frontmatter in ${source}: `, e);
    }
  });

  return result;
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

export const DEFAULT_IGNORE = [
  '/**/node_modules/**',
  '/**/.git/**',
  '/**/tmp/**',
  '/**/dist/**',
  'node_modules/**',
  '.git/**',
  'tmp/**',
  'dist/**'
];
