# @docfy/core

The core components of Docfy, a documentation site builder.

## Compatibility

- Node.js v10 or above

## Installation

```sh
npm install @docfy/core
# or
yarn add @docfy/core
```

## Usage

```js
const Docfy = require('@docfy/core').default;
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

Refer to the [documentation site](https://docfy.dev).

## License

This project is licensed under the [MIT License](LICENSE.md).
