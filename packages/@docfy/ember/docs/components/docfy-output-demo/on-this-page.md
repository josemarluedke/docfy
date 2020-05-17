---
order: 2
---
# On this page

In this example, we are using the option `@fromCurrentURL`. It tells the component
to search for the definition of the page that corresponds to the current URL.
We are then using the `headings` property, a data structure that represents a
Table of Content. The `headings` is a recursive data structure, meaning that you
can render their child for subheadings and their sub-subheadings. The depth of
headings available here is default to 6 but can be changed using the configuration
option `tocMaxDepth`.


```hbs template
<DocfyOutput @fromCurrentURL={{true}} as |page|>
  <div class="mb-4 font-medium text-gray-900">
    On this page:
  </div>
  <ul class="list-disc list-inside space-y-2">
    {{#each page.headings as |heading|}}
      <li>
        <a href="#{{heading.id}}">
          {{heading.title}}
        </a>
      </li>
    {{/each}}
  </ul>
</DocfyOutput>
```
