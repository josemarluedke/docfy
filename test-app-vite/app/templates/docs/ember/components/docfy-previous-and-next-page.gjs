import DocfyDemoComponentsDocfyPreviousAndNextPageSimple from './docfy-previous-and-next-page_gen/docfy-demo-components-docfy-previous-and-next-page-simple.js';
import DocfyDemoComponentsDocfyPreviousAndNextPageScope from './docfy-previous-and-next-page_gen/docfy-demo-components-docfy-previous-and-next-page-scope.js';
import DocfyDemo from 'test-app-vite/components/docfy-demo';

<template>
  <h1 id="docfypreviousandnextpage"><a href="#docfypreviousandnextpage">{{"<DocfyPreviousAndNextPage>"}}</a></h1>
<p>This component yields the previous and next page (<code>PageMetadata</code>) if it exists.
The component accepts a single argument called <code>scope</code>. It is used to narrow the
pages that it can link as previous and next.</p>
<p>Scoping the pages is useful if you are building different sections of your docs site;
for example, one section is "Documentation", and another is "Tutorials". This feature
would prevent linking to a page in tutorials from a documentation page.</p>
<h2 id="examples"><a href="#examples">Examples</a></h2>
<DocfyDemo @id="docfy-demo-components-docfy-previous-and-next-page-simple" as |demo|>
<demo.Description
          @title="Simple usage" @editUrl="https://github.com/josemarluedke/docfy/edit/main/packages/ember-cli/docs/components/docfy-previous-and-next-page-demo/simple.md">

</demo.Description>
<demo.Example>
<DocfyDemoComponentsDocfyPreviousAndNextPageSimple />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="hljs language-hbs"><span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyPreviousAndNextPage</span> <span class="hljs-attr">as</span> |<span class="hljs-attr">previous</span> <span class="hljs-attr">next</span>|></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span>></span>
    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">if</span></span> previous}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"text-sm"</span>></span>Previous<span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>

      <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">previous.url</span>}}</span><span class="xml"><span class="hljs-tag"> <span class="hljs-attr">class</span>=<span class="hljs-string">"text-xl text-blue-500"</span>></span>
        </span><span class="hljs-template-variable">\{{<span class="hljs-name">previous.title</span>}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">if</span></span>}}</span><span class="xml">
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span>></span>
    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">if</span></span> next}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"text-sm"</span>></span>Next<span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>

      <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">next.url</span>}}</span><span class="xml"><span class="hljs-tag"> <span class="hljs-attr">class</span>=<span class="hljs-string">"text-xl text-blue-500"</span>></span>
        </span><span class="hljs-template-variable">\{{<span class="hljs-name">next.title</span>}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">if</span></span>}}</span><span class="xml">
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyPreviousAndNextPage</span>></span></span></code></pre>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-components-docfy-previous-and-next-page-scope" as |demo|>
<demo.Description
          @title="Scoping" @editUrl="https://github.com/josemarluedke/docfy/edit/main/packages/ember-cli/docs/components/docfy-previous-and-next-page-demo/scope.md">
<p>This example passes the argument <code>@scope</code> to the component.</p>
</demo.Description>
<demo.Example>
<DocfyDemoComponentsDocfyPreviousAndNextPageScope />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="hljs language-hbs"><span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyPreviousAndNextPage</span> @<span class="hljs-attr">scope</span>=<span class="hljs-string">"docs"</span> <span class="hljs-attr">as</span> |<span class="hljs-attr">previous</span> <span class="hljs-attr">next</span>|></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span>></span>
    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">if</span></span> previous}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"text-sm"</span>></span>Previous<span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>

      <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">previous.url</span>}}</span><span class="xml"><span class="hljs-tag"> <span class="hljs-attr">class</span>=<span class="hljs-string">"text-xl text-blue-500"</span>></span>
        </span><span class="hljs-template-variable">\{{<span class="hljs-name">previous.title</span>}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">if</span></span>}}</span><span class="xml">
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span>></span>
    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">if</span></span> next}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"text-sm"</span>></span>Next<span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>

      <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">next.url</span>}}</span><span class="xml"><span class="hljs-tag"> <span class="hljs-attr">class</span>=<span class="hljs-string">"text-xl text-blue-500"</span>></span>
        </span><span class="hljs-template-variable">\{{<span class="hljs-name">next.title</span>}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">if</span></span>}}</span><span class="xml">
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyPreviousAndNextPage</span>></span></span></code></pre>
</demo.Snippet>
</DocfyDemo>
<h2 id="api"><a href="#api">API</a></h2>
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
</template>