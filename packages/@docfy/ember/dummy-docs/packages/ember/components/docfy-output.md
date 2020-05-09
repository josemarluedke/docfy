---
category: ember
subcategory: components
---

# Docfy Output Component

Lorem markdownum animaeque obsedit adversam, saevi sed resupina tenuesque levius
tenenti utque. Cornibus et opes crudelia primus procul alvum exit: dum frondes!
Cornibus e, putat procul nostro erat cunctantem munus inventus quod.


## Example of "On this page"

```hbs

<DocfyOutput @fromCurrentURL={{true}} as |page|>
  {{#if page.headings.length}}
    On this page:
    <ul>
      {{#each page.headings as |heading|}}
        <li>
          <DocfyLink @to={{page.url}} @anchor={{heading.id}}>
            {{heading.title}}
          </DocfyLink>
        </li>
      {{/each}}
    </ul>
  {{/if}}
</DocfyOutput>
```

For documentation of `DocfyLink` [click here](./docfy-link.md)
