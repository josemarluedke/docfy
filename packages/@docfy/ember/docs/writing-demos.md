# Writing Demos

Docfy has a concept of "demo" markdown files. It allows you to write code in
markdown and have them be extracted as executable code in the host app. You can
learn more about the file location rules in [Writing Markdown - Demos](../../../../docs/writing-markdown.md#demos).

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
