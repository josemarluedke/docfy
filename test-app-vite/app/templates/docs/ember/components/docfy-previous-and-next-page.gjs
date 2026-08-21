import DocfyDemoEmberComponentsDocfyPreviousAndNextPageSimple from './docfy-previous-and-next-page_gen/docfy-demo-ember-components-docfy-previous-and-next-page-simple.js';
import DocfyDemoEmberComponentsDocfyPreviousAndNextPageScope from './docfy-previous-and-next-page_gen/docfy-demo-ember-components-docfy-previous-and-next-page-scope.js';
import { DocfyDemo } from '@docfy/ember';

<template>
  <h1 id="docfypreviousandnextpage"><a href="#docfypreviousandnextpage">{{"<DocfyPreviousAndNextPage>"}}</a></h1>
<p>This component yields the previous and next page (<code>PageMetadata</code>) if it exists.
The component accepts a single argument called <code>scope</code>. It is used to narrow the
pages that it can link as previous and next.</p>
<p>Scoping the pages is useful if you are building different sections of your docs site;
for example, one section is "Documentation", and another is "Tutorials". This feature
would prevent linking to a page in tutorials from a documentation page.</p>
<h2 id="examples"><a href="#examples">Examples</a></h2>
<DocfyDemo @id="docfy-demo-ember-components-docfy-previous-and-next-page-simple" as |demo|>
<demo.Description
          @title="Simple usage" @editUrl="https://github.com/josemarluedke/docfy/edit/main/.claude/worktrees/remark-upgrade-research-644867/docs/ember/components/docfy-previous-and-next-page-demo/simple.md">

</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyPreviousAndNextPageSimple />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="hljs language-hbs"><span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyPreviousAndNextPage</span> <span class="hljs-keyword">as</span> |<span class="hljs-template-variable">previous</span> <span class="hljs-template-variable">next</span>|></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-title">div</span>></span>
    <span class="hljs-punctuation mustache">\{{#<span class="hljs-title"><span class="hljs-built_in">if</span></span> <span class="hljs-title">previous</span>}}</span>
      <span class="hljs-tag">&#x3C;<span class="hljs-title">div</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'text-sm'</span>></span>Previous<span class="hljs-tag">&#x3C;/<span class="hljs-title">div</span>></span>

      <span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyLink</span> <span class="hljs-punctuation">@</span><span class="hljs-params">to</span><span class="hljs-operator">=</span><span class="hljs-punctuation mustache">\{{<span class="hljs-title">previous</span><span class="hljs-punctuation">.</span><span class="hljs-title">url</span>}}</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'text-xl text-blue-500'</span>></span>
        <span class="hljs-punctuation mustache">\{{<span class="hljs-title">previous</span><span class="hljs-punctuation">.</span><span class="hljs-title">title</span>}}</span>
      <span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyLink</span>></span>
    <span class="hljs-punctuation mustache">\{{/<span class="hljs-title"><span class="hljs-built_in">if</span></span>}}</span>
  <span class="hljs-tag">&#x3C;/<span class="hljs-title">div</span>></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-title">div</span>></span>
    <span class="hljs-punctuation mustache">\{{#<span class="hljs-title"><span class="hljs-built_in">if</span></span> <span class="hljs-title">next</span>}}</span>
      <span class="hljs-tag">&#x3C;<span class="hljs-title">div</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'text-sm'</span>></span>Next<span class="hljs-tag">&#x3C;/<span class="hljs-title">div</span>></span>

      <span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyLink</span> <span class="hljs-punctuation">@</span><span class="hljs-params">to</span><span class="hljs-operator">=</span><span class="hljs-punctuation mustache">\{{<span class="hljs-title">next</span><span class="hljs-punctuation">.</span><span class="hljs-title">url</span>}}</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'text-xl text-blue-500'</span>></span>
        <span class="hljs-punctuation mustache">\{{<span class="hljs-title">next</span><span class="hljs-punctuation">.</span><span class="hljs-title">title</span>}}</span>
      <span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyLink</span>></span>
    <span class="hljs-punctuation mustache">\{{/<span class="hljs-title"><span class="hljs-built_in">if</span></span>}}</span>
  <span class="hljs-tag">&#x3C;/<span class="hljs-title">div</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyPreviousAndNextPage</span>></span>
</code></pre>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-ember-components-docfy-previous-and-next-page-scope" as |demo|>
<demo.Description
          @title="Scoping" @editUrl="https://github.com/josemarluedke/docfy/edit/main/.claude/worktrees/remark-upgrade-research-644867/docs/ember/components/docfy-previous-and-next-page-demo/scope.md">
<p>This example passes the argument <code>@scope</code> to the component.</p>
</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyPreviousAndNextPageScope />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="hljs language-hbs"><span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyPreviousAndNextPage</span> <span class="hljs-punctuation">@</span><span class="hljs-params">scope</span><span class="hljs-operator">=</span><span class="hljs-string">'docs'</span> <span class="hljs-keyword">as</span> |<span class="hljs-template-variable">previous</span> <span class="hljs-template-variable">next</span>|></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-title">div</span>></span>
    <span class="hljs-punctuation mustache">\{{#<span class="hljs-title"><span class="hljs-built_in">if</span></span> <span class="hljs-title">previous</span>}}</span>
      <span class="hljs-tag">&#x3C;<span class="hljs-title">div</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'text-sm'</span>></span>Previous<span class="hljs-tag">&#x3C;/<span class="hljs-title">div</span>></span>

      <span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyLink</span> <span class="hljs-punctuation">@</span><span class="hljs-params">to</span><span class="hljs-operator">=</span><span class="hljs-punctuation mustache">\{{<span class="hljs-title">previous</span><span class="hljs-punctuation">.</span><span class="hljs-title">url</span>}}</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'text-xl text-blue-500'</span>></span>
        <span class="hljs-punctuation mustache">\{{<span class="hljs-title">previous</span><span class="hljs-punctuation">.</span><span class="hljs-title">title</span>}}</span>
      <span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyLink</span>></span>
    <span class="hljs-punctuation mustache">\{{/<span class="hljs-title"><span class="hljs-built_in">if</span></span>}}</span>
  <span class="hljs-tag">&#x3C;/<span class="hljs-title">div</span>></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-title">div</span>></span>
    <span class="hljs-punctuation mustache">\{{#<span class="hljs-title"><span class="hljs-built_in">if</span></span> <span class="hljs-title">next</span>}}</span>
      <span class="hljs-tag">&#x3C;<span class="hljs-title">div</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'text-sm'</span>></span>Next<span class="hljs-tag">&#x3C;/<span class="hljs-title">div</span>></span>

      <span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyLink</span> <span class="hljs-punctuation">@</span><span class="hljs-params">to</span><span class="hljs-operator">=</span><span class="hljs-punctuation mustache">\{{<span class="hljs-title">next</span><span class="hljs-punctuation">.</span><span class="hljs-title">url</span>}}</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'text-xl text-blue-500'</span>></span>
        <span class="hljs-punctuation mustache">\{{<span class="hljs-title">next</span><span class="hljs-punctuation">.</span><span class="hljs-title">title</span>}}</span>
      <span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyLink</span>></span>
    <span class="hljs-punctuation mustache">\{{/<span class="hljs-title"><span class="hljs-built_in">if</span></span>}}</span>
  <span class="hljs-tag">&#x3C;/<span class="hljs-title">div</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyPreviousAndNextPage</span>></span>
</code></pre>
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