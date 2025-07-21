import DocfyDemoComponentsDocfyOutputSidebar from './docfy-output_gen/docfy-demo-components-docfy-output-sidebar.js';
import DocfyDemoComponentsDocfyOutputOnThisPage from './docfy-output_gen/docfy-demo-components-docfy-output-on-this-page.js';
import DocfyDemoComponentsDocfyOutputEditPage from './docfy-output_gen/docfy-demo-components-docfy-output-edit-page.js';
import DocfyDemoComponentsDocfyOutputTopNav from './docfy-output_gen/docfy-demo-components-docfy-output-top-nav.js';
import DocfyDemoComponentsDocfyOutputFlat from './docfy-output_gen/docfy-demo-components-docfy-output-flat.js';
import DocfyDemo from 'test-app-vite/components/docfy-demo';

<template>
  <h1 id="docfyoutput"><a href="#docfyoutput">{{"<DocfyOutput>"}}</a></h1>
<p>This component exposes some of the result data from the build that you can use
to render, for example, a sidebar navigation, "on this page" section, and more.</p>
<p>Depending on the arguments you pass to the component, the output could be one of
the following values:</p>
<ul>
<li><code>NestedPageMetadata</code></li>
<li><code>PageMetadata[]</code></li>
<li><code>PageMetadata</code></li>
<li><code>undefined</code></li>
</ul>
<p>To learn more about each data type, please refer to the API docs.</p>
<p>Below you can see several examples of what is possible to build using this component.</p>
<h2 id="examples"><a href="#examples">Examples</a></h2>
<DocfyDemo @id="docfy-demo-components-docfy-output-sidebar" as |demo|>
<demo.Description
          @title="Sidebar Navigation" @editUrl="https://github.com/josemarluedke/docfy/edit/main/packages/ember-cli/docs/components/docfy-output-demo/sidebar.md">
<p>In this example, we are filtering the <code>NestedPageMetadata</code> by the scope name <code>docs</code>.
Then we use the yielded data to render pages, their children, and their children's
pages. Depending on how your documentation is structured, you might need to render
more deep into the tree or more shadow.</p>
<blockquote>
<p>You might have noticed that for this documentation site, we haven't rendered
too deep into the tree to display all items.</p>
</blockquote>
</demo.Description>
<demo.Example>
<DocfyDemoComponentsDocfyOutputSidebar />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="hljs language-hbs"><span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyOutput</span> @<span class="hljs-attr">scope</span>=<span class="hljs-string">"docs"</span> <span class="hljs-attr">as</span> |<span class="hljs-attr">node</span>|></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">ul</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"list-disc list-inside space-y-2"</span>></span>
    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">each</span></span> node.pages <span class="hljs-keyword">as</span> |page|}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;<span class="hljs-name">li</span>></span>
        <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">page.url</span>}}</span><span class="xml"><span class="hljs-tag">></span>
          </span><span class="hljs-template-variable">\{{<span class="hljs-name">page.title</span>}}</span><span class="xml">
        <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
      <span class="hljs-tag">&#x3C;/<span class="hljs-name">li</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">each</span></span>}}</span><span class="xml">

    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">each</span></span> node.children <span class="hljs-keyword">as</span> |child|}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;<span class="hljs-name">li</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"block ml-4"</span>></span>
        <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"py-2"</span>></span>
          </span><span class="hljs-template-variable">\{{<span class="hljs-name">child.label</span>}}</span><span class="xml">
        <span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>

        <span class="hljs-tag">&#x3C;<span class="hljs-name">ul</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"list-disc list-inside space-y-2"</span>></span>
          </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">each</span></span> child.pages <span class="hljs-keyword">as</span> |page|}}</span><span class="xml">
            <span class="hljs-tag">&#x3C;<span class="hljs-name">li</span>></span>
              <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">page.url</span>}}</span><span class="xml"><span class="hljs-tag">></span>
                </span><span class="hljs-template-variable">\{{<span class="hljs-name">page.title</span>}}</span><span class="xml">
              <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
            <span class="hljs-tag">&#x3C;/<span class="hljs-name">li</span>></span>
          </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">each</span></span>}}</span><span class="xml">
        <span class="hljs-tag">&#x3C;/<span class="hljs-name">ul</span>></span>
      <span class="hljs-tag">&#x3C;/<span class="hljs-name">li</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">each</span></span>}}</span><span class="xml">
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">ul</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyOutput</span>></span></span></code></pre>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-components-docfy-output-on-this-page" as |demo|>
<demo.Description
          @title="On this page" @editUrl="https://github.com/josemarluedke/docfy/edit/main/packages/ember-cli/docs/components/docfy-output-demo/on-this-page.md">
<p>In this example, we are using the option <code>@fromCurrentURL</code>. It tells the component
to search for the definition of the page that corresponds to the current URL.
We are then using the <code>headings</code> property, a data structure that represents a
Table of Content. The <code>headings</code> is a recursive data structure, meaning that you
can render their child for subheadings and their sub-subheadings. The depth of
headings available here is default to 6 but can be changed using the configuration
option <code>tocMaxDepth</code>.</p>
</demo.Description>
<demo.Example>
<DocfyDemoComponentsDocfyOutputOnThisPage />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="hljs language-hbs"><span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyOutput</span> @<span class="hljs-attr">fromCurrentURL</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">true</span>}}</span><span class="xml"><span class="hljs-tag"> <span class="hljs-attr">as</span> |<span class="hljs-attr">page</span>|></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"mb-4 font-medium"</span>></span>
    On this page:
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">ul</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"list-disc list-inside space-y-2"</span>></span>
    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">each</span></span> page.headings <span class="hljs-keyword">as</span> |heading|}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;<span class="hljs-name">li</span>></span>
        <span class="hljs-tag">&#x3C;<span class="hljs-name">a</span> <span class="hljs-attr">href</span>=<span class="hljs-string">"#</span></span></span><span class="hljs-template-variable">\{{<span class="hljs-name">heading.id</span>}}</span><span class="xml"><span class="hljs-tag"><span class="hljs-string">"</span>></span>
          </span><span class="hljs-template-variable">\{{<span class="hljs-name">heading.title</span>}}</span><span class="xml">
        <span class="hljs-tag">&#x3C;/<span class="hljs-name">a</span>></span>
      <span class="hljs-tag">&#x3C;/<span class="hljs-name">li</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">each</span></span>}}</span><span class="xml">
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">ul</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyOutput</span>></span></span></code></pre>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-components-docfy-output-edit-page" as |demo|>
<demo.Description
          @title="Edit this page" @editUrl="https://github.com/josemarluedke/docfy/edit/main/packages/ember-cli/docs/components/docfy-output-demo/edit-page.md">
<p>This is another example using <code>@fromCurrentURL</code>, but here we build a "edit this
page" link.</p>
<p>For this feature to work, Docfy must be able to find the repository URL. In
Ember apps, we extract that from the <code>package.json</code>, but you can configure the
repository URL as well as the branch to edit.</p>
<p>For this to work, you need to include <code>repository</code> in your docfy-config:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// in your docfy-config.js</span>
<span class="hljs-built_in">module</span>.exports = {
  <span class="hljs-attr">repository</span>: {
    <span class="hljs-attr">url</span>: <span class="hljs-string">'https://github.com/@username/repo-name'</span>,
    <span class="hljs-attr">editBranch</span>: <span class="hljs-string">'main'</span>,
  },
  ...<span class="hljs-comment">// rest of your config</span>
}</code></pre>
<h2 id="enterprise-aka-on-premise-git-services"><a href="#enterprise-aka-on-premise-git-services">Enterprise (aka on premise) git services</a></h2>
<p><code>page.editUrl</code> works for Github, Bitbucket, Gitlab and Sourcehut.</p>
<p>For on-premise instances git solutions (i.e. on-premise Gitlab, or on-premise Bitbucket), we expose the <code>page.relativePath</code> so that you might construct your own custom editUrl:</p>
<pre><code class="hljs language-hbs"><span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyOutput</span> @<span class="hljs-attr">fromCurrentURL</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">true</span>}}</span><span class="xml"><span class="hljs-tag"> <span class="hljs-attr">as</span> |<span class="hljs-attr">page</span>|></span>
  </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">if</span></span> page.relativePath}}</span><span class="xml">
    <span class="hljs-tag">&#x3C;<span class="hljs-name">a</span> <span class="hljs-attr">href</span>=<span class="hljs-string">(concat</span> "<span class="hljs-attr">http:</span>//<span class="hljs-attr">some-enterpise.com</span>/<span class="hljs-attr">browse</span>/" <span class="hljs-attr">page.relativePath</span>)
      <span class="hljs-attr">Click</span> <span class="hljs-attr">here</span> <span class="hljs-attr">to</span> <span class="hljs-attr">edit</span> <span class="hljs-attr">this</span> <span class="hljs-attr">page</span>
    &#x3C;/<span class="hljs-attr">a</span>></span>
  </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">if</span></span>}}</span><span class="xml">
<span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyOutput</span>></span></span></code></pre>
<p>Note: the edit url for your on-premise instance might be more complex than the example above. But the <code>page.relativePath</code> will give you the relative path to that file in your repo.</p>
</demo.Description>
<demo.Example>
<DocfyDemoComponentsDocfyOutputEditPage />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="hljs language-hbs"><span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyOutput</span> @<span class="hljs-attr">fromCurrentURL</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">true</span>}}</span><span class="xml"><span class="hljs-tag"> <span class="hljs-attr">as</span> |<span class="hljs-attr">page</span>|></span>
  </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">if</span></span> page.editUrl}}</span><span class="xml">
    <span class="hljs-tag">&#x3C;<span class="hljs-name">a</span> <span class="hljs-attr">href</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">page.editUrl</span>}}</span><span class="xml"><span class="hljs-tag">></span>
      Click here to edit this page
    <span class="hljs-tag">&#x3C;/<span class="hljs-name">a</span>></span>
  </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">if</span></span>}}</span><span class="xml">
<span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyOutput</span>></span></span></code></pre>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-components-docfy-output-top-nav" as |demo|>
<demo.Description
          @title="Top Navigation" @editUrl="https://github.com/josemarluedke/docfy/edit/main/packages/ember-cli/docs/components/docfy-output-demo/top-nav.md">
<p>Here is another example that builds a top nav that could be used for the entire
application. It will link to any top-level pages as well as to the first page of
every child.</p>
</demo.Description>
<demo.Example>
<DocfyDemoComponentsDocfyOutputTopNav />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="hljs language-hbs"><span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyOutput</span> @<span class="hljs-attr">type</span>=<span class="hljs-string">"nested"</span> <span class="hljs-attr">as</span> |<span class="hljs-attr">node</span>|></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">ul</span>></span>
    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">each</span></span> node.pages <span class="hljs-keyword">as</span> |page|}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;<span class="hljs-name">li</span>></span>
        <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">page.url</span>}}</span><span class="xml"><span class="hljs-tag">></span>
          </span><span class="hljs-template-variable">\{{<span class="hljs-name">page.title</span>}}</span><span class="xml">
        <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
     <span class="hljs-tag">&#x3C;/<span class="hljs-name">li</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">each</span></span>}}</span><span class="xml">

    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">each</span></span> node.children <span class="hljs-keyword">as</span> |child|}}</span><span class="xml">
      </span><span class="hljs-template-tag">\{{#<span class="hljs-name">let</span> (<span class="hljs-name"><span class="hljs-builtin-name">get</span></span> child.pages <span class="hljs-number">0</span>) <span class="hljs-keyword">as</span> |page|}}</span><span class="xml">
        </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">if</span></span> page}}</span><span class="xml">
          <span class="hljs-tag">&#x3C;<span class="hljs-name">li</span>></span>
            <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">page.url</span>}}</span><span class="xml"><span class="hljs-tag">></span>
              </span><span class="hljs-template-variable">\{{<span class="hljs-name">child.label</span>}}</span><span class="xml">
            <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
          <span class="hljs-tag">&#x3C;/<span class="hljs-name">li</span>></span>
        </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">if</span></span>}}</span><span class="xml">
      </span><span class="hljs-template-tag">\{{/<span class="hljs-name">let</span>}}</span><span class="xml">
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">each</span></span>}}</span><span class="xml">
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">ul</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyOutput</span>></span></span></code></pre>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-components-docfy-output-flat" as |demo|>
<demo.Description
          @title="Flat output" @editUrl="https://github.com/josemarluedke/docfy/edit/main/packages/ember-cli/docs/components/docfy-output-demo/flat.md">
<p>This option will return an array of <code>PageMetadata</code>. It will contain all the
pages in a flat array, one could render a list of all the pages without worrying
about the scope.</p>
</demo.Description>
<demo.Example>
<DocfyDemoComponentsDocfyOutputFlat />
</demo.Example>
<demo.Snippet @name="template">
<pre><code class="hljs language-hbs"><span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyOutput</span> @<span class="hljs-attr">type</span>=<span class="hljs-string">"flat"</span> <span class="hljs-attr">as</span> |<span class="hljs-attr">pages</span>|></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">ul</span> <span class="hljs-attr">class</span>=<span class="hljs-string">"list-disc list-inside space-y-2"</span>></span>
    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">each</span></span> pages <span class="hljs-keyword">as</span> |page|}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;<span class="hljs-name">li</span>></span>
        <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">page.url</span>}}</span><span class="xml"><span class="hljs-tag">></span>
          </span><span class="hljs-template-variable">\{{<span class="hljs-name">page.title</span>}}</span><span class="xml">
        <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
     <span class="hljs-tag">&#x3C;/<span class="hljs-name">li</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">each</span></span>}}</span><span class="xml">
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">ul</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyOutput</span>></span></span></code></pre>
</demo.Snippet>
</DocfyDemo>
<h2 id="api"><a href="#api">API</a></h2>
<p>This component has a few different options that are used to filter what the
returning value should be. Here is the arguments this component accepts.</p>
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
<td><code>@type</code></td>
<td>If the result should be a flat list or nested</td>
<td><code>'flat'</code> | <code>'nested'</code></td>
<td><code>'nested'</code></td>
</tr>
<tr>
<td><code>@fromCurrentURL</code></td>
<td>If the result should be filtered from the current URL</td>
<td><code>boolean</code> | <code>undefined</code></td>
<td></td>
</tr>
<tr>
<td><code>@url</code></td>
<td>Find the page definition for the given URL</td>
<td><code>string</code> | <code>undefined</code></td>
<td></td>
</tr>
<tr>
<td><code>@scope</code></td>
<td>If the result should be filtered by an scope name</td>
<td><code>string</code> | <code>undefined</code></td>
<td></td>
</tr>
</tbody>
</table>
</template>