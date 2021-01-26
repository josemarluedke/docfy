import { NestedPageMetadata, PageMetadata } from '@docfy/core/lib/types';

export default function flatNested(
  output?: NestedPageMetadata,
  pages: PageMetadata[] = []
): PageMetadata[] {
  if (typeof output === 'undefined') {
    return [];
  }

  pages.push(...output.pages);

  output.children.forEach((child) => {
    flatNested(child, pages);
  });

  return pages;
}
