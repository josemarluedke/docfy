# Tomster

Lovable hamster

```hbs template
<div data-test-id="tomster">
  {{#let (array 1 2 3 4 5) as |numbers|}}
    <ol>
      {{#each numbers as |number|}}
        <li>Here is number {{number}}</li>
      {{/each}}
    </ol>
  {{/let}}
</div>
```
