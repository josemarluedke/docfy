import { DocfyLink } from '@docfy/ember';
import { DocfyCodeBlock } from '@docfy/ember';

<template>
  <h1 id="writing-markdown"><a href="#writing-markdown">Writing Markdown</a></h1>
<p>For most developers writing markdown is something they are used to; therefore,
they can use their previous knowledge for writing markdowns in the context of Docfy.
In case you are not familiar with markdown, <a href="https://www.markdownguide.org/basic-syntax/">check this guide out</a>.</p>
<p>We use <a href="https://remark.js.org/">remark</a> for processing markdown files,
it is extremely customizable by its <a href="https://github.com/remarkjs/remark/blob/master/doc/plugins.md">plugins</a>
architecture and the
<a href="https://github.com/syntax-tree/mdast">Markdown Abstract Syntax Tree (MDAST)</a>
format that it uses. Everything is possible with plugins, such as
<a href="https://github.com/remarkjs/remark-lint">checking Markdown code style (remark-lint)</a>,
<a href="https://github.com/mapbox/remark-react">transforming safely to React (remark-react)</a>,
or <a href="https://github.com/remarkjs/remark-toc">adding a table of contents (remark-toc)</a>.</p>
<h2 id="front-matter"><a href="#front-matter">Front Matter</a></h2>
<p>Front Matter allows you to customize the result of Docfy by the built-in properties
and exposes any additional values to its consumer. Docfy uses YAML format with <code>---</code> as the marker.</p>
<DocfyCodeBlock ><pre><code>---
order: 1
title: Front Matter is awesome
category: core
---
</code></pre></DocfyCodeBlock>
<h3 id="built-in-properties"><a href="#built-in-properties">Built-in Properties</a></h3>
<ul>
<li><strong>order</strong>? : <em>number</em> - The order of the page to other pages. This option is
useful for defining the order of elements when displaying on a navigation sidebar.</li>
<li><strong>title</strong>? : <em>string</em> - The title of the page if different then the heading
in the markdown. This property can be used to inform consumers to build the sidebar navigation.</li>
<li><strong>url</strong>? : <em>string</em> - Use this option to overwrite the auto-generated URL for
the page. The URL will still contain any prefix or suffix specified for the source.</li>
<li><strong>category</strong>? : <em>string</em> - This property is used when the source URL Schema is
set to <code>manual</code>. Refer to <DocfyLink @to="/docs/configuration" @anchor="urlschema" >Source Configuration</DocfyLink> to learn more.</li>
<li><strong>subcategory</strong>? : <em>string</em> - This property is used when the source URL Schema is set to <code>manual</code>.</li>
</ul>
<blockquote>
<p>All buil-in properties are optional, and some might not make sense to include if another is included.
For example, <code>url</code> and <code>category/subcategory</code> doesn't make sense to be defined in the same document.</p>
</blockquote>
<h3 id="custom-properties"><a href="#custom-properties">Custom Properties</a></h3>
<p>Any properties you pass in the Front Matter will be available to Docfy consumers.
These properties can are useful for extending or modifying behavior in the
final result.</p>
<p>One example could be a plugin that takes the value of a property called <code>hideTitle</code>
and then modifies the markdown AST to remove the first heading of the document.</p>
<DocfyCodeBlock ><pre><code>---
order: 2
hideTitle: true
---
</code></pre></DocfyCodeBlock>
<h2 id="linking-to-other-documents"><a href="#linking-to-other-documents">Linking to other Documents</a></h2>
<p>Writing documentation usually require links to other documents to give more
information to users. You can use relative URLs to the actual file on disk to
create a link to that document. This feature is essential to allow markdown files
to customize its URL and not to manually change all references in your documentation to the new URL.</p>
<p>Example:</p>
<DocfyCodeBlock @language="md"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="md"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline">Link to another document</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">](</span><span style="--shiki-light:#24292E;--shiki-light-text-decoration:underline;--shiki-dark:#E1E4E8;--shiki-dark-text-decoration:underline">./other-document.md</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">)</span></span></code></pre></DocfyCodeBlock>
<p>The markdown will be modified to the URL of that document. By the simplest case,
it would be something like <code>/docs/other-document</code>. The actual URL depends on the configuration of the source.</p>
<blockquote>
<p>If Docfy is not able to find the document it is referring to, the URL will not be modified.</p>
</blockquote>
<h2 id="static-assets"><a href="#static-assets">Static Assets</a></h2>
<p>You can also link to static files such as images. Docfy will collect any
reference to images and make them available to consumers so that they can move
these assets to a public folder. Docfy will modify the URL of these assets using
the <DocfyLink @to="/docs/configuration" @anchor="staticassetspath" >base configuration <code>staticAssetsPath</code></DocfyLink>.</p>
<p>These static assets can be placed next to documents; there is no need to put them
in a particular folder, although you can if you would like so.</p>
<p>Example:</p>
<DocfyCodeBlock @language="md"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="md"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">![</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline">GitHub</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">](</span><span style="--shiki-light:#24292E;--shiki-light-text-decoration:underline;--shiki-dark:#E1E4E8;--shiki-dark-text-decoration:underline">./github-icon.png</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">)</span></span></code></pre></DocfyCodeBlock>
<h2 id="demos"><a href="#demos">Demos</a></h2>
<p>Docfy has a default plugin that combines "demo" markdown files into the data
structure that represents a page. This feature is useful for consumers to extract
components to create executable code out of markdown files. By default, Docfy will
only combine these demo pages, and it's up to the consumers to decide what to do
with them. An excellent example of what is possible can be found in the Ember
implementation of demo components. Below you can find the rules that Docfy uses
to decide who the owner of the given demo is.</p>
<p>Let's say we have the following file structure in our documentation folder:</p>
<DocfyCodeBlock ><pre><code>├── components
│   ├── button-demo
│   │   └── demo1.md
│   ├── button.md
│   └── form
│       ├── demo
│       │   ├── demo1.md
│       │   └── demo2.md
│       └── index.md
</code></pre></DocfyCodeBlock>
<p>You can see we have two components that we are documenting, first button and then form.</p>
<ol>
<li>We can see the first rule in the button component. Docfy looks at folders named
<code>*-demo</code>; then, it will use the first part to find a document that matches that name.
In this case, <code>button.md</code>, which is then considered the owner of the demos.</li>
<li>We can see the second rule in the form component. Docfy looks at folders named
<code>demo</code>. In this case, we have a folder named <code>form</code> and inside of it, a folder
called <code>demo</code>, and a file called <code>index.md</code>. Docfy understands that the owner of
the demos is <code>forms/index.md</code>.</li>
</ol>
<blockquote>
<p>Any markdown file under <code>*-demo</code> or <code>demo</code> folders are considered a demo and will not be rendered as a standalone page.</p>
</blockquote>
<p>An example of a demo file can be seen below. This demo is actually how the
Ember demo integration looks like.</p>
<DocfyCodeBlock @language="md"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="md"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold"># Demo of DocfyLink component</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">This is a cool feature</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```hbs template</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">This is my Demo:</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">this.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>My Link&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```js component</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> Component </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@glimmer/component'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> MyDemo</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Component</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  url</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '/docs/ember/'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```</span></span></code></pre></DocfyCodeBlock>
</template>