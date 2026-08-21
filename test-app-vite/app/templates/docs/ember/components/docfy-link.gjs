import DocfyDemoEmberComponentsDocfyLinkSimple from './docfy-link_gen/docfy-demo-ember-components-docfy-link-simple.js';
import DocfyDemoEmberComponentsDocfyLinkAnchor from './docfy-link_gen/docfy-demo-ember-components-docfy-link-anchor.js';
import { DocfyDemo } from '@docfy/ember';

<template>
  <h1 id="docfylink"><a href="#docfylink">{{"<DocfyLink>"}}</a></h1>
<p>This component is useful for linking to pages created by Docfy. It understands
how the routing in Ember was designed and can correctly link to a given page URL.
If the component is not able to figure out the correct Ember route, it will fall
back to setting <code>windown.location</code> directly.</p>
<p>DocfyLink can also link to an anchor; this allows for linking to specific sections
on a page. Note that linking to an anchor may cause a full-page reload given that
Ember doesn't have support for anchors.</p>
<blockquote>
<p>Docfy also uses this component internally to replace any links between your
markdown files. It gives a pleasant User Experience because it can use the
Ember Routing to make the page transition, removing the need for a full-page reload.</p>
</blockquote>
<p>Below you can see a simple example of this component; however, you can see more
of its usage throughout the documentation.</p>
<h2 id="examples"><a href="#examples">Examples</a></h2>
<DocfyDemo @id="docfy-demo-ember-components-docfy-link-simple" as |demo|>
<demo.Description
          @title="Simple Example" @editUrl="https://github.com/josemarluedke/docfy/edit/main/.claude/worktrees/remark-upgrade-research-644867/docs/ember/components/docfy-link-demo/simple.md">

</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyLinkSimple />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="hljs language-hbs"><span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyLink</span> <span class="hljs-punctuation">@</span><span class="hljs-params">to</span><span class="hljs-operator">=</span><span class="hljs-string">'/docs'</span>></span>
  Link to Docs
<span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyLink</span>></span>
</code></pre>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-ember-components-docfy-link-anchor" as |demo|>
<demo.Description
          @title="Example with Anchor" @editUrl="https://github.com/josemarluedke/docfy/edit/main/.claude/worktrees/remark-upgrade-research-644867/docs/ember/components/docfy-link-demo/anchor.md">

</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyLinkAnchor />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="hljs language-hbs"><span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyOutput</span> <span class="hljs-punctuation">@</span><span class="hljs-params">fromCurrentURL</span><span class="hljs-operator">=</span><span class="hljs-punctuation mustache">\{{<span class="hljs-title"><span class="hljs-literal">true</span></span>}}</span> <span class="hljs-keyword">as</span> |<span class="hljs-template-variable">page</span>|></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyLink</span> <span class="hljs-punctuation">@</span><span class="hljs-params">to</span><span class="hljs-operator">=</span><span class="hljs-punctuation mustache">\{{<span class="hljs-title">page</span><span class="hljs-punctuation">.</span><span class="hljs-title">url</span>}}</span> <span class="hljs-punctuation">@</span><span class="hljs-params">anchor</span><span class="hljs-operator">=</span><span class="hljs-string">'examples'</span>></span>
    Link to a anchor
  <span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyLink</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyOutput</span>></span>
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
<td><code>@to</code></td>
<td>The URL to link</td>
<td><code>string</code></td>
<td></td>
</tr>
<tr>
<td><code>@anchor</code></td>
<td>An anchor</td>
<td><code>string</code> | <code>undefined</code></td>
<td></td>
</tr>
<tr>
<td><code>@activeClass</code></td>
<td>The classes to be added when the link is active</td>
<td><code>string</code> | <code>undefined</code></td>
<td></td>
</tr>
</tbody>
</table>
</template>