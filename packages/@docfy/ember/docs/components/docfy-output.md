---
order: 1
category: components
title: <DocfyOutput>
---

# {{"<DocfyOutput>"}}

This component exposes some of the result data from the build that you can use
to render, for example, sidebar navigation, "on this page" section, and more.

This component has a few different options that are used to filter what the
returning value should be.  Below you can see its interface definition.

```ts
interface DocfyOutputArgs {
  type?: 'flat' | 'nested';
  fromCurrentURL?: boolean;
  url?: string;
  scope?: string;
}
```

Depending on the arguments you pass to the component, the output could be one of
the following values:

- `NestedPageMetadata`
- `PageMetadata[]`
- `PageMetadata`
- `undefined`

To learn more about each data type, please refer to the API docs.

Below you can see several examples of what is possible to build using this component.
