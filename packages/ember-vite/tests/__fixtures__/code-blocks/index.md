---
title: Code Blocks
---

# Code Blocks

A plain fence:

```js
const a = 1;
```

A fence with options:

```gts title="app/components/thing.gts" collapsible showLineNumbers
const b = 2;
```

A fence with copying disabled:

```sh noCopy
echo hi
```

A fence containing curlies, which Ember's template compiler would otherwise
try to parse as a mustache:

```hbs
{{#if this.value}}<span>{{this.value}}</span>{{/if}}
```
