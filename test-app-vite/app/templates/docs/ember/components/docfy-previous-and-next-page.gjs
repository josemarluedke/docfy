import DocfyDemoComponentsDocfyPreviousAndNextPageSimple from './docfy-previous-and-next-page_gen/docfy-demo-components-docfy-previous-and-next-page-simple.js';
import DocfyDemoComponentsDocfyPreviousAndNextPageScope from './docfy-previous-and-next-page_gen/docfy-demo-components-docfy-previous-and-next-page-scope.js';
import DocfyDemo from 'test-app-vite/components/docfy-demo';


<template>
  <h1 id="docfypreviousandnextpage">{{"<DocfyPreviousAndNextPage>"}}</h1>
<p>This component yields the previous and next page (<code>PageMetadata</code>) if it exists.
The component accepts a single argument called <code>scope</code>. It is used to narrow the
pages that it can link as previous and next.</p>
<p>Scoping the pages is useful if you are building different sections of your docs site;
for example, one section is "Documentation", and another is "Tutorials". This feature
would prevent linking to a page in tutorials from a documentation page.</p>
<h2 id="examples">Examples</h2>
<DocfyDemo @id="docfy-demo-components-docfy-previous-and-next-page-simple" as |demo|>
<demo.Description
          @title="Simple usage" >

</demo.Description>
<demo.Example>
<DocfyDemoComponentsDocfyPreviousAndNextPageSimple />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="language-hbs">&#x3C;DocfyPreviousAndNextPage as |previous next|>
  &#x3C;div>
    \{{#if previous}}
      &#x3C;div class="text-sm">Previous&#x3C;/div>

      &#x3C;DocfyLink @to=\{{previous.url}} class="text-xl text-blue-500">
        \{{previous.title}}
      &#x3C;/DocfyLink>
    \{{/if}}
  &#x3C;/div>
  &#x3C;div>
    \{{#if next}}
      &#x3C;div class="text-sm">Next&#x3C;/div>

      &#x3C;DocfyLink @to=\{{next.url}} class="text-xl text-blue-500">
        \{{next.title}}
      &#x3C;/DocfyLink>
    \{{/if}}
  &#x3C;/div>
&#x3C;/DocfyPreviousAndNextPage>
</code></pre>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-components-docfy-previous-and-next-page-scope" as |demo|>
<demo.Description
          @title="Scoping" >
<p>This example passes the argument <code>@scope</code> to the component.</p>
</demo.Description>
<demo.Example>
<DocfyDemoComponentsDocfyPreviousAndNextPageScope />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="language-hbs">&#x3C;DocfyPreviousAndNextPage @scope="docs" as |previous next|>
  &#x3C;div>
    \{{#if previous}}
      &#x3C;div class="text-sm">Previous&#x3C;/div>

      &#x3C;DocfyLink @to=\{{previous.url}} class="text-xl text-blue-500">
        \{{previous.title}}
      &#x3C;/DocfyLink>
    \{{/if}}
  &#x3C;/div>
  &#x3C;div>
    \{{#if next}}
      &#x3C;div class="text-sm">Next&#x3C;/div>

      &#x3C;DocfyLink @to=\{{next.url}} class="text-xl text-blue-500">
        \{{next.title}}
      &#x3C;/DocfyLink>
    \{{/if}}
  &#x3C;/div>
&#x3C;/DocfyPreviousAndNextPage>
</code></pre>
</demo.Snippet>
</DocfyDemo>
<h2 id="api">API</h2>
<table>
<thead>
<tr>
<th>Argument</th>
<th>Description</th>
<th>Type</th>
<th>Default Value</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>@scope</code></td>
<td>Filter links by a scope name</td>
<td><code>string</code> | <code>undefined</code></td>
<td></td>
</tr>
</tbody>
</table>

<h2>Examples</h2>

<DocfyDemo @id="docfy-demo-components-docfy-previous-and-next-page-simple" as |demo|>
<demo.Example><DocfyDemoComponentsDocfyPreviousAndNextPageSimple /></demo.Example>
</DocfyDemo>

<DocfyDemo @id="docfy-demo-components-docfy-previous-and-next-page-scope" as |demo|>
<demo.Example><DocfyDemoComponentsDocfyPreviousAndNextPageScope /></demo.Example>
</DocfyDemo>


</template>