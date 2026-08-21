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

Docfy is published as ES modules and requires Node `>=22.22.2`.

Two separate constraints combine to produce that floor. Docfy needs `require()` of
an ES module to work, which is what lets CommonJS tooling (Ember CLI, a CommonJS
config file) load Docfy and ESM-only remark/rehype plugins; that support landed in
Node 20.19 and 22.12. The floor is higher than those versions because
`hosted-git-info`, the dependency Docfy uses to build "edit this page" links,
requires 22.22.2 as its own minimum.

That dependency expresses its range as a list of LTS lines, which excludes
odd-numbered releases such as Node 23 and 25. Docfy uses a plain `>=` instead, so
developing on a current release does not produce install warnings.

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
