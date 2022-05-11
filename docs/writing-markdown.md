---
order: 4
---

# Writing Markdown

For most developers writing markdown is something they are used to; therefore,
they can use their previous knowledge for writing markdowns in the context of Docfy.
In case you are not familiar with markdown, [check this guide out](https://www.markdownguide.org/basic-syntax/).

We use [remark](https://remark.js.org/) for processing markdown files,
it is extremely customizable by its [plugins](https://github.com/remarkjs/remark/blob/master/doc/plugins.md)
architecture and the
[Markdown Abstract Syntax Tree (MDAST)](https://github.com/syntax-tree/mdast)
format that it uses. Everything is possible with plugins, such as
[checking Markdown code style (remark-lint)](https://github.com/remarkjs/remark-lint),
[transforming safely to React (remark-react)](https://github.com/mapbox/remark-react),
or [adding a table of contents (remark-toc)](https://github.com/remarkjs/remark-toc).

## Front Matter

Front Matter allows you to customize the result of Docfy by the built-in properties
and exposes any additional values to its consumer. Docfy uses YAML format with `---` as the marker.

```
---
order: 1
title: Front Matter is awesome
category: core
---
```

### Built-in Properties

- **order**? : _number_ - The order of the page to other pages. This option is
  useful for defining the order of elements when displaying on a navigation sidebar.
- **title**? : _string_ - The title of the page if different then the heading
  in the markdown. This property can be used to inform consumers to build the sidebar navigation.
- **url**? : _string_ - Use this option to overwrite the auto-generated URL for
  the page. The URL will still contain any prefix or suffix specified for the source.
- **category**? : _string_ - This property is used when the source URL Schema is
  set to `manual`. Refer to [Source Configuration](./configuration.md#urlschema) to learn more.
- **subcategory**? : _string_ - This property is used when the source URL Schema is set to `manual`.

> All buil-in properties are optional, and some might not make sense to include if another is included.
> For example, `url` and `category/subcategory` doesn't make sense to be defined in the same document.

### Custom Properties

Any properties you pass in the Front Matter will be available to Docfy consumers.
These properties can are useful for extending or modifying behavior in the
final result.

One example could be a plugin that takes the value of a property called `hideTitle`
and then modifies the markdown AST to remove the first heading of the document.

```
---
order: 2
hideTitle: true
---
```

## Linking to other Documents

Writing documentation usually require links to other documents to give more
information to users. You can use relative URLs to the actual file on disk to
create a link to that document. This feature is essential to allow markdown files
to customize its URL and not to manually change all references in your documentation to the new URL.

Example:

```md
[Link to another document](./other-document.md)
```

The markdown will be modified to the URL of that document. By the simplest case,
it would be something like `/docs/other-document`. The actual URL depends on the configuration of the source.

> If Docfy is not able to find the document it is referring to, the URL will not be modified.

## Static Assets

You can also link to static files such as images. Docfy will collect any
reference to images and make them available to consumers so that they can move
these assets to a public folder. Docfy will modify the URL of these assets using
the [base configuration `staticAssetsPath`](./configuration.md#staticassetspath).

These static assets can be placed next to documents; there is no need to put them
in a particular folder, although you can if you would like so.

Example:

```md
![GitHub](./github-icon.png)
```

## Demos

Docfy has a default plugin that combines "demo" markdown files into the data
structure that represents a page. This feature is useful for consumers to extract
components to create executable code out of markdown files. By default, Docfy will
only combine these demo pages, and it's up to the consumers to decide what to do
with them. An excellent example of what is possible can be found in the Ember
implementation of demo components. Below you can find the rules that Docfy uses
to decide who the owner of the given demo is.

Let's say we have the following file structure in our documentation folder:

```
├── components
│   ├── button-demo
│   │   └── demo1.md
│   ├── button.md
│   └── form
│       ├── demo
│       │   ├── demo1.md
│       │   └── demo2.md
│       └── index.md
```

You can see we have two components that we are documenting, first button and then form.

1. We can see the first rule in the button component. Docfy looks at folders named
   `*-demo`; then, it will use the first part to find a document that matches that name.
   In this case, `button.md`, which is then considered the owner of the demos.
2. We can see the second rule in the form component. Docfy looks at folders named
   `demo`. In this case, we have a folder named `form` and inside of it, a folder
   called `demo`, and a file called `index.md`. Docfy understands that the owner of
   the demos is `forms/index.md`.

> Any markdown file under `*-demo` or `demo` folders are considered a demo and will not be rendered as a standalone page.

An example of a demo file can be seen below. This demo is actually how the
Ember demo integration looks like.

````md
# Demo of DocfyLink component

This is a cool feature

```hbs template
This is my Demo:

<DocfyLink @to={{this.url}}>My Link</DocfyLink>
```

```js component
import Component from '@glimmer/component';

export default class MyDemo extends Component {
  url = '/docs/ember/';
}
```
````
