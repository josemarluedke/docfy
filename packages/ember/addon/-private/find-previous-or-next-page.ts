import { NestedPageMetadata, PageMetadata } from '@docfy/core/lib/types';
import flatNested from './flat-nested';

export default function findPreviousOrNextPage(
  url: string,
  isPrevious: boolean,
  nested: NestedPageMetadata
): PageMetadata | undefined {
  const flat = flatNested(nested);
  const index = flat.findIndex((page) => {
    return page.url === url || page.url === `${url}/`;
  });

  if (index > -1) {
    if (isPrevious) {
      return flat[index - 1];
    } else {
      return flat[index + 1];
    }
  }
  return undefined;
}
