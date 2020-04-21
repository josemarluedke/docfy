# Docfy ![](https://github.com/josemarluedke/docfy/workflows/CI/badge.svg)

Documentation Builder

**Under active development.**

## Usage

### Core

The example below uses TypeScript.

```ts
import Docfy from '@docfy/core';
import path from 'path';
import hbs from 'remark-hbs';
import autolinkHeadings from 'remark-autolink-headings';

const projectRoot = '../tests/__fixtures__/monorepo/';
const root = path.resolve(__dirname, projectRoot);

(async function (): Promise<void> {
  const docfy = new Docfy({
    remarkPlugins: [[autolinkHeadings, { behavior: 'append' }], hbs]
  });

  const docs = await docfy.run([
    {
      root,
      urlPrefix: 'docs',
      urlSchema: 'manual',
      pattern: '/**/*.md'
    }
  ]);

  console.log(docs);
})();
```

## Compatibility

* Node.js v10 or above

## License

This project is licensed under the [MIT License](LICENSE.md).
