import path from 'path';
import visit from 'unist-util-visit';
import { Node } from 'unist';
import { Page } from './types';
import toString from 'mdast-util-to-string';
import Slugger from 'github-slugger';
import YAML from 'yaml';
import url from 'url';

const slug = Slugger.slug;

export function generateManualUrl(
  source: string,
  meta: Page['metadata'],
  prefix?: string,
  suffix?: string
): string {
  const parts: string[] = [''];
  if (prefix) {
    parts.push(prefix);
  }
  if (meta.package) {
    parts.push(slug(meta.package));
  }
  if (meta.category) {
    parts.push(slug(meta.category));
  }
  let fileName = path.parse(path.basename(source)).name;
  if (fileName === 'index') {
    fileName = path.basename(path.dirname(source));
  }
  parts.push(`${fileName}${suffix || ''}`);
  return parts.join('/');
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

  let fileName = path.parse(parts.pop() as string).name;
  if (fileName === 'index') {
    fileName = path.basename(path.dirname(source));
    parts.pop(); // remove duplicated folder name
  }

  parts.push(`${fileName}${suffix || ''}`);
  return parts.join('/');
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

export function parseFrontmatter(source: string, ast: Node): object {
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
