<img width="978" alt="Docfy Logo" src="https://repository-images.githubusercontent.com/254531229/d6e4fc80-5efd-11eb-9c08-99fd3d8bce07">
<p align="center">
  <a href="https://github.com/josemarluedke/docfy/actions?query=workflow%3ACI"><img src="https://github.com/josemarluedke/docfy/workflows/CI/badge.svg" alt="Build Status"></a>
  <a href="https://github.com/josemarluedke/docfy/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license"></a>
</p>

Docfy is a modular JavaScript tool to help build documentation sites. Its core
has all the essential features to help you create a full-featured docs app while
writing all your content in Markdown.

## Documentation

Visit [docfy.dev](https://docfy.dev/) to read the docs and see live demos.

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
      pattern: '**/*.md'
    }
  ]);

  console.log(docs);
})();
```

## Compatibility

- Node.js v12 or above

## License

This project is licensed under the [MIT License](LICENSE.md).
