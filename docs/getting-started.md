---
order: 2
---

# Getting Started

Here you can find a simple getting started with the Docfy Core. The core will
output an object with the processed content, metadata, and some additional data
structures for your convenience.

## Create the project

```sh
mkdir docfy-core-getting-started && cd docfy-core-getting-started
```

```sh
npm init
# or
yarn init
```

## Requirements

Docfy is published as ES modules and requires Node `^20.19.0 || >=22.12.0`. Those
are the Node versions that support `require()` of ES modules, which is what lets
CommonJS tooling (Ember CLI, a CommonJS config file) load Docfy and ESM-only
remark/rehype plugins.

## Add `@docfy/core` as a dependency

```sh
npm install @docfy/core
# or
yarn add @docfy/core
```

## Initialize Docfy

```js
// index.mjs
import Docfy from '@docfy/core';
import path from 'path';

new Docfy()
  .run([
    {
      root: path.join(import.meta.dirname, 'docs'),
      urlPrefix: 'docs',
      pattern: '**/*.md',
    },
  ])
  .then(result => {
    console.log(result);
  });
```

## Create a markdown file

```sh
mkdir docs
echo '# Hello Docfy.' > docs/README.md
```

If you would rather stay in CommonJS, that works too — `require()` returns the
module namespace, so reach for `.default`:

```js
// index.cjs
const Docfy = require('@docfy/core').default;
const path = require('path');
```

## Run your script

Now you can run the `index.mjs` we created earlier.

```sh
node index.mjs
```
