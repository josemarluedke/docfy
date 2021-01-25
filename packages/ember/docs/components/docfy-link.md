---
order: 2
category: components
title: <DocfyLink>
---

# {{"<DocfyLink>"}}

This component is useful for linking to pages created by Docfy. It understands
how the routing in Ember was designed and can correctly link to a given page URL.
If the component is not able to figure out the correct Ember route, it will fall
back to setting `windown.location` directly.

DocfyLink can also link to an anchor; this allows for linking to specific sections
on a page. Note that linking to an anchor may cause a full-page reload given that
Ember doesn't have support for anchors.

> Docfy also uses this component internally to replace any links between your
> markdown files. It gives a pleasant User Experience because it can use the
> Ember Routing to make the page transition, removing the need for a full-page reload.


Below you can see a simple example of this component; however, you can see more
of its usage throughout the documentation.

# API

| Argument       | Description                                     | Type                    | Default Value |
|----------------|-------------------------------------------------|-------------------------|---------------|
| `@to`          | The URL to link                                 | `string`                |               |
| `@anchor`      | An anchor                                       | `string` \| `undefined` |               |
| `@activeClass` | The classes to be added when the link is active | `string` \| `undefined` |               |
