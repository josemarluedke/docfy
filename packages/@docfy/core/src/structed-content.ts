import { Content, StructuredContent } from './types';
import util from 'util';

function inspect(obj: unknown): void {
  console.log(util.inspect(obj, false, 4, true));
}

function validateMetadata(
  metadata: Content['metadata'],
  filepath: string
): metadata is {
  title: NonNullable<Content['metadata']['title']>;
  order: NonNullable<Content['metadata']['order']>;
  package: Content['metadata']['package'];
  category: Content['metadata']['category'];
} {
  if (!metadata.title) {
    console.error(`${filepath} is missing title in frontmatter`);
    return false;
  }

  if (typeof !metadata.order === 'undefined') {
    console.error(`${filepath} is missing order in frontmatter`);
    return false;
  }

  return true;
}

function createStructedContent(
  contents: Content[],
  existingStruct?: StructuredContent
): StructuredContent {
  const structedContent: StructuredContent = existingStruct || {
    pages: [],
    categories: {},
    packages: {}
  };

  contents.forEach((item: Content, _: number): void => {
    const meta = item.metadata;
    if (validateMetadata(meta, item.filepath)) {
      if (meta.package) {
        const pkgName = meta.package;
        structedContent.packages[pkgName] = createStructedContent(
          [{ ...item, metadata: { ...meta, package: undefined } }],
          structedContent.packages[pkgName]
        );
      } else if (meta.category) {
        if (!structedContent.categories[meta.category]) {
          structedContent.categories[meta.category] = [];
        }
        structedContent.categories[meta.category].push(item);
      } else {
        structedContent.pages.push(item);
      }
    }
  });

  return structedContent;
}

export default function (contents: Content[]): StructuredContent {
  const result = createStructedContent(contents);
  inspect(result);
  return result;
}
