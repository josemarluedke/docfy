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

const root = path.resolve(__dirname, '../path-to-my-project');

(async function (): Promise<void> {
  const docs = await Docfy({
    root,
    sources: [
      {
        urlPrefix: 'docs',
        pattern: '{/**/docs/**/*.md,/**/**/*.md,/**/addon/**/*.md}',
        ignore: ['/packages/docs/**']
      }
    ],
    remarkPlugins: [hbs]
  });

  console.log(docs);
})();
```

## Compatibility

* Node.js v10 or above

## License

This project is licensed under the [MIT License](LICENSE.md).
