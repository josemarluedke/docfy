# Example with Anchor

```hbs template
<DocfyOutput @fromCurrentURL={{true}} as |page|>
  <DocfyLink @to={{page.url}} @anchor='examples'>
    Link to a anchor
  </DocfyLink>
</DocfyOutput>
```
