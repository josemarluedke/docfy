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
format that it uses.  Everything is possible with plugins, such as
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


- **order**? : *number* - The order of the page to other pages. This option is
  useful for defining the order of elements when displaying on a navigation sidebar.
- **title**? : *string* - The title of the page if different then the heading
  in the markdown. This property can be used to inform consumers to build the sidebar navigation.
- **url**? : *string* - Use this option to overwrite the auto-generated URL for
  the page. The URL will still contain any prefix or suffix specified for the source.
- **category**? : *string* - This property is used when the source URL Schema is
  set to `manual`.  Refer to [Source Configuration](./configuration.md#urlschema) to learn more.
- **subcategory**? : *string* - This property is used when the source URL Schema is set to `manual`.

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
