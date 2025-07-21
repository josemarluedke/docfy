---
order: 5
---

# Flat output

This option will return an array of `PageMetadata`. It will contain all the
pages in a flat array, one could render a list of all the pages without worrying
about the scope.

```hbs template
<DocfyOutput @type="flat" as |pages|>
  <ul class="list-disc list-inside space-y-2">
    {{#each pages as |page|}}
      <li>
        <DocfyLink @to={{page.url}}>
          {{page.title}}
        </DocfyLink>
     </li>
    {{/each}}
  </ul>
</DocfyOutput>
```
