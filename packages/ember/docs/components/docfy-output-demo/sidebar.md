---
order: 1
---

# Sidebar Navigation

In this example, we are filtering the `NestedPageMetadata` by the scope name `docs`.
Then we use the yielded data to render pages, their children, and their children's
pages. Depending on how your documentation is structured, you might need to render
more deep into the tree or more shadow.

> You might have noticed that for this documentation site, we haven't rendered
> too deep into the tree to display all items.

```hbs template
<DocfyOutput @scope='docs' as |node|>
  <ul class='list-disc list-inside space-y-2'>
    {{#each node.pages as |page|}}
      <li>
        <DocfyLink @to={{page.url}}>
          {{page.title}}
        </DocfyLink>
      </li>
    {{/each}}

    {{#each node.children as |child|}}
      <li class='block ml-4'>
        <div class='py-2'>
          {{child.label}}
        </div>

        <ul class='list-disc list-inside space-y-2'>
          {{#each child.pages as |page|}}
            <li>
              <DocfyLink @to={{page.url}}>
                {{page.title}}
              </DocfyLink>
            </li>
          {{/each}}
        </ul>
      </li>
    {{/each}}
  </ul>
</DocfyOutput>
```
