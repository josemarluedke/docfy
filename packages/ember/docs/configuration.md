---
order: 2
---
# Configuration

Docfy has a set of options you can configure and might have read about them
[here](../../../docs/configuration.md). You might have been wondering how
to set these options in the Ember app context.

The Docfy integration with Ember reads a file named `.docfy-config.js` from the
root of your app to set the config.

In this file, you can add any Remark Plugins, add markdown file sources, and more.

Below is a example of a configuration file.

```js
// .docfy-config.js

const path = require('path');
const autolinkHeadings = require('remark-autolink-headings');
const highlight = require('remark-highlight.js');
const codeImport = require('remark-code-import');

module.exports = {
  remarkPlugins: [
    [
      autolinkHeadings,
      { behavior: 'wrap' }
    ],
    codeImport,
    highlight
  ],
  sources: [
    {
      root: path.resolve(__dirname, '../../../docs'),
      pattern: '**/*.md',
      urlSchema: 'manual',
      urlPrefix: 'docs'
    },
    {
      root: path.join(__dirname, 'docs'),
      pattern: '**/*.md',
      urlSchema: 'manual',
      urlPrefix: 'docs/ember'
    }
  ],
  labels: {
    components: 'Components',
    core: '@docfy/core',
    ember: '@docfy/ember',
    docs: 'Documentation'
  }
};
```

> You are not required to create this file. If Docfy cannot find it, we will
> use a default configuration. By default markdown files are read from `docs`
> in the root of the Ember app.
