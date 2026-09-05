import DocfyDemoEmberComponentsDocfyPreviousAndNextPageSimple from './docfy-previous-and-next-page_gen/docfy-demo-ember-components-docfy-previous-and-next-page-simple.js';
import DocfyDemoEmberComponentsDocfyPreviousAndNextPageScope from './docfy-previous-and-next-page_gen/docfy-demo-ember-components-docfy-previous-and-next-page-scope.js';
import { DocfyDemo } from '@docfy/ember';
import { DocfyCodeBlock } from '@docfy/ember';

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
          @title="Simple usage" @editUrl="https://github.com/josemarluedke/docfy/edit/main/docs/ember/components/docfy-previous-and-next-page-demo/simple.md">

</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyPreviousAndNextPageSimple />
</demo.Example>
<demo.Snippet @name="template">
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyPreviousAndNextPage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> as |previous next|></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#if</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> previous</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'text-sm'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Previous&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">previous.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'text-xl text-blue-500'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">        \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">previous.title</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#if</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> next</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'text-sm'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Next&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">next.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'text-xl text-blue-500'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">        \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">next.title</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyPreviousAndNextPage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-ember-components-docfy-previous-and-next-page-scope" as |demo|>
<demo.Description
          @title="Scoping" @editUrl="https://github.com/josemarluedke/docfy/edit/main/docs/ember/components/docfy-previous-and-next-page-demo/scope.md">
<p>This example passes the argument <code>@scope</code> to the component.</p>
</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyPreviousAndNextPageScope />
</demo.Example>
<demo.Snippet @name="template">
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyPreviousAndNextPage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">scope=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> as |previous next|></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#if</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> previous</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'text-sm'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Previous&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">previous.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'text-xl text-blue-500'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">        \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">previous.title</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#if</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> next</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'text-sm'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Next&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">next.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'text-xl text-blue-500'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">        \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">next.title</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyPreviousAndNextPage</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
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