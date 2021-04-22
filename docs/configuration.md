---
order: 3
---

# Configuration

Docfy has a few options you can change to enhance and, or modify Docfy behavior. There are two categories of options, first, base configuration, and second, the source of files configuration.

## Base configuration

Here you can customize the base options, such as the Docfy plugins, remark
plugins, rehype plugins, the git repository URL, and more.
Below you can see an example of how to pass these options to Docfy.

```js
const Docfy = require('@docfy/core');

const docfy = new Docfy({
  plugins: [],
  remarkPlugins: [],
  rehypePlugins: [],
  staticAssetsPath: '/assets/docfy',
  tocMaxDepth: 6,
  repository: {
    url: 'https://github.com/josemarluedke/docfy'
  }
});
```

### `plugins`

• **plugins**? : _Plugin[]_ - A list of Docfy plugins.

### `remarkPlugins`

• **remarkPlugins**? : _function | [function, RemarkPluginOptions][]_ - Additional remark plugins

Example:

```js
const hbs = require('remark-hbs');
const autolinkHeadings = require('remark-autolink-headings');

const remarkPlugins = [autolinkHeadings, hbs];

//...
```

In case the plugin has options, you can specify as the example below:

```js
// ..
const remarkPlugins = [
  [
    autolinkHeadings,
    {
      behavior: 'wrap'
    }
  ]
];
```

### `rehypePlugins`

• **rehypePlugins**? : _function | [function, RehypePluginOptions][]_ - Additional rehype plugins

You can also pass options to rehype plugins the same way as remark plugins.

### `staticAssetsPath`

• **staticAssetsPath**? : _string_ - The static asset path to be used in the URL. Assets such as images are considered static.

**`default`** "/assets/docfy"

### `tocMaxDepth`

• **tocMaxDepth**? : _number_ - The max depth of headings

**`default`** 6

### `labels`

• **labels**? : _Record‹string, string›_ - Labels to be used while generating `nestedPageMetadata`.

### `repository`

• **repository**? : _RepositoryConfig_ - The repository config.

Example:

```js
const config = {
  repository: {
    url: 'https://github.com/josemarluedke/docfy',
    editBranch: 'main'
  }
};
```

#### `RepositoryConfig`

- **url**: _string_ - The URL to the Git Repository, for example: `https://github.com/josemarluedke/docfy`
- **editBranch**? : _string_ - Branch used to edit your markdown when clicking
  on an "Edit this page" link. **defaults to `"master"`**

## Source Configuration

Here you specify where your markdown content should come from. Additionally, you can setup options for the URLs and overwrite the base repository config.
Below you can see an example of how to pass these options to Docfy.

```js
// ...
docfy
  .run([
    {
      root: __dirname,
      pattern: '**/*.md',
      ignore: ['private/**'],
      urlPrefix: 'docs',
      urlSchema: 'manual'
    }
  ])
  .then((result) => {
    console.log(result);
  });
```

### root

• **root**: _string_

This option specifies the absolute path indicating where to search for markdown files.

### `pattern`

• **pattern**: _string_

Match files using the patterns the shell uses, like stars and stuff.

### `ignore`

• **ignore**? : _string[]_

List of files to ignore, it can be a specific file or a pattern.

### `urlPrefix`

• **urlPrefix**? : _string_

The prefix for URLs.

For example:
`docs` will generate URls like `/docs/something`
`blog` will generate urls like `/blog/something`

### `urlSuffix`

• **urlSuffix**? : _string_

The suffix the URLs.

For example:
`.html` will generate urls like `/something.html`

### `urlSchema`

• **urlSchema**? : _"auto" | "manual"_

Indicates how the URLs are generated.

1. **`auto`**: Uses the folder structure to inform how the URLs structure.
   For example, if you have the following files:

   ```
   - install.md
   - components/
     - button.md
     - card.md
   ```

   The URLs would look like this, (assuming `urlPrefix` is set to `docs`).

   ```
   - docs/install
   - docs/components/buttons
   - docs/components/card
   ```

2. **`manual`**: It uses Front Matter information to inform "category" and
   "subcategory" of the file, ignoring the original file location.
   Resulting in the following schema: `{category}/{subcategory}/{file-name}`

   If no category or subcategory is specified, all files will be at the root level. This option is perfect for documenting monorepo projects to keep
   documentation files next to its implementation.

### repository

• **repository**? : _RepositoryConfig_

Overwrite base repository config for this source.
