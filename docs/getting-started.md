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

## Add `@docfy/core` as a dependency

```sh
npm install @docfy/core
# or
yarn add @docfy/core
```

## Initialize Docfy

```js
// index.js
const Docfy = require('@docfy/core');
const path = require('path');

new Docfy()
  .run([
    {
      root: path.join(__dirname, 'docs'),
      urlPrefix: 'docs',
      pattern: '**/*.md'
    }
  ])
  .then((result) => {
    console.log(result);
  });
```

## Create a markdown file

```sh
mkdir docs
echo '# Hello Docfy.' > docs/README.md
```

## Run your script

Now you can run the `index.js` we created earlier.

```sh
node index.js
```
