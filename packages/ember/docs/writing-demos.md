---
order: 3
---

# Writing Demos

Docfy has a concept of "demo" markdown files. It allows you to write code in
markdown and have them be extracted as executable code in the host app. You can
learn more about the file location rules in [Writing Markdown - Demos](../../../docs/writing-markdown.md#demos).

In the context of Ember, all demos are extracted as components. These components
can have a template, component, and style code block. Components can also be
template only components by only specifying the HBS template.

> Note that styles will be extracted as a co-located file with the component,
> it would only work if your host app is using [Ember CSS Modules](https://github.com/salsify/ember-css-modules)
> or something similar.

Below you can see how a demo markdown file looks like.

```md file=writing-demos-demo/demo1.md

```

The demo will be injected into the owner file as a new section called "Examples";
you can see it below.

Please note that you must pass a metadata to the code block, it can be seen
after the file type in the example above. The meta is used to identify the purpose
of the code block. The possible values are `component`, `template`, and `styles`.

> You can write TypeScript for the component JS as well, if your host app is
> configured to support it.

## Preview Template

When writing documentation in Ember apps, we might want to write some template
code to demonstrate how to use a component whilst also having the code
executed to embed the same template into the rendered markdown. Creating a
demo markdown might be too much of an effort; for this purpose, Docfy has
another feature called `preview-template`. It will extract the template from
the markdown code block and create a component backed by an empty Glimmer
component class to provide a `this` context so helpers such as `mut` or `set`
can be used within the demonstration. It will also add the code snippet so
users can see the code.

Below is an example of how it works:

````md
```hbs preview-template
Click in the link to navigate to the home page: <DocfyLink @to="/">Home</DocfyLink>
```
````

And here you can see how it looks like when rendered:

```hbs preview-template
Click in the link to navigate to the home page: <DocfyLink @to="/">Home</DocfyLink>
```
