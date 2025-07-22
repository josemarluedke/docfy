---
category: ember
---

# Preview works with gts, gjs

This works

```gts preview
import Component from "@glimmer/component";

// components/hello.gjs
export default class Hello extends Component {
  isThisCool = true;

  <template>Is This Cool?: {{this.isThisCool}}</template>
}
```
