# Simple usage

```hbs template
<DocfyPreviousAndNextPage as |previous next|>
  <div>
    {{#if previous}}
      <div class="text-sm">Previous</div>

      <DocfyLink @to={{previous.url}} class="text-xl text-blue-500">
        {{previous.title}}
      </DocfyLink>
    {{/if}}
  </div>
  <div>
    {{#if next}}
      <div class="text-sm">Next</div>

      <DocfyLink @to={{next.url}} class="text-xl text-blue-500">
        {{next.title}}
      </DocfyLink>
    {{/if}}
  </div>
</DocfyPreviousAndNextPage>
```
