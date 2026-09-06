import DocfyDemoEmberComponentsDocfyLinkSimple from './docfy-link_gen/docfy-demo-ember-components-docfy-link-simple.js';
import DocfyDemoEmberComponentsDocfyLinkAnchor from './docfy-link_gen/docfy-demo-ember-components-docfy-link-anchor.js';
import { DocfyDemo } from '@docfy/ember';
import { DocfyCodeBlock } from '@docfy/ember';

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
          @title="Simple Example" @editUrl="https://github.com/josemarluedke/docfy/edit/main/docs/ember/components/docfy-link-demo/simple.md">

</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyLinkSimple />
</demo.Example>
<demo.Snippet @name="template">
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'/docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  Link to Docs</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-ember-components-docfy-link-anchor" as |demo|>
<demo.Description
          @title="Example with Anchor" @editUrl="https://github.com/josemarluedke/docfy/edit/main/docs/ember/components/docfy-link-demo/anchor.md">

</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyLinkAnchor />
</demo.Example>
<demo.Snippet @name="template">
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">fromCurrentURL=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">true</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> as |page|></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">anchor=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'examples'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    Link to a anchor</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
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