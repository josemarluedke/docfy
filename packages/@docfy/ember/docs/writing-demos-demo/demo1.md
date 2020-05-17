# Demo of Docfy Demos :D

This is a cool feature of Docfy. It is perfect for documenting design systems and
component libraries.

> Note that this text is extracted into the demo.

```hbs template
This is my Demo: <DocfyLink @to={{this.url}}>My Link</DocfyLink>
```

```js component
import Component from '@glimmer/component';

export default class MyDemo extends Component {
  url = '/docs'
}
```
