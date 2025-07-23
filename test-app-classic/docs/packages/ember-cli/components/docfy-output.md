---
category: ember
subcategory: components
---

# Docfy Output Component

Lorem markdownum animaeque obsedit adversam, saevi sed resupina tenuesque levius
tenenti utque. Cornibus et opes crudelia primus procul alvum exit: dum frondes!
Cornibus e, putat procul nostro erat cunctantem munus inventus quod.

## Example of "On this page"

```gjs
import { DocfyOutput } from "@docfy/ember";

<template>
  <DocfyOutput @fromCurrentURL={{true}} as |page|>
    {{log page}}
  </DocfyOutput>
</template>
```

For documentation of `DocfyLink` [click here](./docfy-link.md)
