---
order: 2
---

# Demo of DocfyLink component

This is a cool feature.

[Link from a demo](../docfy-output.md)

```hbs template
<div data-test-id="demo-1">
  This is my Demo:

  <DocfyLink @to={{this.url}}>My Link</DocfyLink>
</div>
<div data-test-id="demo-1-js-data">{{this.url}}</div>
```

```js component
import Component from '@glimmer/component';

export default class MyDemo extends Component {
  url = '/docs/ember/';
}
```
