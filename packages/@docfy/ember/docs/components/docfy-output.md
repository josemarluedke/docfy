---
order: 1
category: components
title: <DocfyOutput>
---

# {{"<DocfyOutput>"}}

This component exposes some of the result data from the build that you can use
to render, for example, a sidebar navigation, "on this page" section, and more.


Depending on the arguments you pass to the component, the output could be one of
the following values:

- `NestedPageMetadata`
- `PageMetadata[]`
- `PageMetadata`
- `undefined`

To learn more about each data type, please refer to the API docs.

Below you can see several examples of what is possible to build using this component.

# API

This component has a few different options that are used to filter what the
returning value should be. Here is the arguments this component accepts.

| Argument          | Description                                           | Type                     | Default Value |
|-------------------|-------------------------------------------------------|--------------------------|---------------|
| `@type`           | If the result should be a flat list or nested         | `'flat'` \| `'nested'`   | `'nested'`    |
| `@fromCurrentURL` | If the result should be filtered from the current URL | `boolean` \| `undefined` |               |
| `@url`            | Find the page definition for the given URL            | `string` \| `undefined`  |               |
| `@scope`          | If the result should be filtered by an scope name     | `string` \| `undefined`  |               |
