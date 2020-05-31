# Demo of DocfyLink component

This is a cool feature.

[Link from a demo](../docfy-output.md)

```hbs template
This is my Demo:

<DocfyLink @to={{this.url}}>My Link</DocfyLink>
```

```js component
import Component from '@glimmer/component';

export default class MyDemo extends Component {
  url = '/docs/ember/'
}
```
