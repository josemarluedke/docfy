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

For this to work, you need to include `repository` in your docfy-config:

```js
// in your docfy-config.js
module.exports = {
  repository: {
    url: 'https://github.com/@username/repo-name',
    editBranch: 'main',
  },
  ...// rest of your config
}
```


## Enterprise (aka on premise) git services

`page.editUrl` works for Github, Bitbucket, Gitlab and Sourcehut.

For on-premise instances git solutions (i.e. on-premise Gitlab, or on-premise Bitbucket), we expose the `page.relativePath` so that you might construct your own custom editUrl:

```hbs 
<DocfyOutput @fromCurrentURL={{true}} as |page|>
  {{#if page.relativePath}}
    <a href=(concat "http://some-enterpise.com/browse/" page.relativePath)
      Click here to edit this page
    </a>
  {{/if}}
</DocfyOutput>
```

Note: the edit url for your on-premise instance might be more complex than the example above. But the `page.relativePath` will give you the relative path to that file in your repo. 
