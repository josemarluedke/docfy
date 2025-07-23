---
order: 4
---

# Top Navigation

Here is another example that builds a top nav that could be used for the entire
application. It will link to any top-level pages as well as to the first page of
every child.

```hbs template
<DocfyOutput @type='nested' as |node|>
  <ul>
    {{#each node.pages as |page|}}
      <li>
        <DocfyLink @to={{page.url}}>
          {{page.title}}
        </DocfyLink>
      </li>
    {{/each}}

    {{#each node.children as |child|}}
      {{#let (get child.pages 0) as |page|}}
        {{#if page}}
          <li>
            <DocfyLink @to={{page.url}}>
              {{child.label}}
            </DocfyLink>
          </li>
        {{/if}}
      {{/let}}
    {{/each}}
  </ul>
</DocfyOutput>
```
