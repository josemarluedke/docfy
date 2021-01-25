---
order: 3
---
# Edit this page

This is another example using `@fromCurrentURL`, but here we build a "edit this
page" link.

For this feature to work, Docfy must be able to find the repository URL. In
Ember apps, we extract that from the `package.json`, but you can configure the
repository URL as well as the branch to edit.

```hbs template
<DocfyOutput @fromCurrentURL={{true}} as |page|>
  {{#if page.editUrl}}
    <a href={{page.editUrl}}>
      Click here to edit this page
    </a>
  {{/if}}
</DocfyOutput>
```
