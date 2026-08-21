<template>
  <h1 id="configuration"><a href="#configuration">Configuration</a></h1>
<p>Docfy has a few options you can change to enhance and, or modify Docfy behavior. There are two categories of options, first, base configuration, and second, the source of files configuration.</p>
<h2 id="base-configuration"><a href="#base-configuration">Base configuration</a></h2>
<p>Here you can customize the base options, such as the Docfy plugins, remark
plugins, rehype plugins, the git repository URL, and more.
Below you can see an example of how to pass these options to Docfy.</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">Docfy</span> <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/core'</span>;

<span class="hljs-keyword">const</span> docfy = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Docfy</span>({
  <span class="hljs-attr">plugins</span>: [],
  <span class="hljs-attr">remarkPlugins</span>: [],
  <span class="hljs-attr">rehypePlugins</span>: [],
  <span class="hljs-attr">staticAssetsPath</span>: <span class="hljs-string">'/assets/docfy'</span>,
  <span class="hljs-attr">tocMaxDepth</span>: <span class="hljs-number">6</span>,
  <span class="hljs-attr">repository</span>: {
    <span class="hljs-attr">url</span>: <span class="hljs-string">'https://github.com/josemarluedke/docfy'</span>,
  },
  <span class="hljs-attr">sections</span>: {
    <span class="hljs-attr">docs</span>: { <span class="hljs-attr">label</span>: <span class="hljs-string">'Documentation'</span>, <span class="hljs-attr">order</span>: <span class="hljs-number">1</span> },
    <span class="hljs-attr">api</span>: { <span class="hljs-attr">label</span>: <span class="hljs-string">'API Reference'</span>, <span class="hljs-attr">order</span>: <span class="hljs-number">2</span> },
  },
});
</code></pre>
<h3 id="plugins"><a href="#plugins"><code>plugins</code></a></h3>
<p>• <strong>plugins</strong>? : <em>Plugin[]</em> - A list of Docfy plugins.</p>
<h3 id="remarkplugins"><a href="#remarkplugins"><code>remarkPlugins</code></a></h3>
<p>• <strong>remarkPlugins</strong>? : <em>function | [function, RemarkPluginOptions][]</em> - Additional remark plugins</p>
<p>Example:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> hbs <span class="hljs-keyword">from</span> <span class="hljs-string">'remark-hbs'</span>;
<span class="hljs-keyword">import</span> codeImport <span class="hljs-keyword">from</span> <span class="hljs-string">'remark-code-import'</span>;

<span class="hljs-keyword">const</span> remarkPlugins = [codeImport, hbs];

<span class="hljs-comment">//...</span>
</code></pre>
<p>In case the plugin has options, you can specify as the example below:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// ..</span>
<span class="hljs-keyword">const</span> remarkPlugins = [
  [
    codeImport,
    {
      <span class="hljs-attr">preserveTrailingNewline</span>: <span class="hljs-literal">true</span>,
    },
  ],
];
</code></pre>
<h3 id="rehypeplugins"><a href="#rehypeplugins"><code>rehypePlugins</code></a></h3>
<p>• <strong>rehypePlugins</strong>? : <em>function | [function, RehypePluginOptions][]</em> - Additional rehype plugins</p>
<p>You can also pass options to rehype plugins the same way as remark plugins.</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> autolinkHeadings <span class="hljs-keyword">from</span> <span class="hljs-string">'rehype-autolink-headings'</span>;
<span class="hljs-keyword">import</span> highlight <span class="hljs-keyword">from</span> <span class="hljs-string">'rehype-highlight'</span>;

<span class="hljs-keyword">const</span> rehypePlugins = [[autolinkHeadings, { <span class="hljs-attr">behavior</span>: <span class="hljs-string">'wrap'</span> }], highlight];
</code></pre>
<p>Most of the remark/rehype ecosystem is ESM-only. Docfy requires a Node version
that supports <code>require()</code> of ES modules, so you can load those plugins from a
CommonJS config file as well — just remember that <code>require()</code> hands you the
module namespace:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// .docfy-config.js (CommonJS)</span>
<span class="hljs-keyword">const</span> highlight = <span class="hljs-built_in">require</span>(<span class="hljs-string">'rehype-highlight'</span>).<span class="hljs-property">default</span>;
</code></pre>
<h4 id="syntax-highlighting"><a href="#syntax-highlighting">Syntax highlighting</a></h4>
<p>Highlighting is a rehype concern. Use
<a href="https://github.com/rehypejs/rehype-highlight"><code>rehype-highlight</code></a> (highlight.js)
or <a href="https://github.com/timlrx/rehype-prism-plus"><code>rehype-prism-plus</code></a> (Prism).
The older <code>remark-highlight.js</code> and <code>@mapbox/rehype-prism</code> packages are
unmaintained and pinned to highlight.js 10 / old refractor builds; they do not
work with the current unified stack.</p>
<p>For Ember, <code>rehype-highlight</code> with
<a href="https://github.com/NullVoxPopuli/highlightjs-glimmer"><code>highlightjs-glimmer</code></a>
gives proper <code>gjs</code>/<code>gts</code>/<code>hbs</code> highlighting:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> highlight <span class="hljs-keyword">from</span> <span class="hljs-string">'rehype-highlight'</span>;
<span class="hljs-keyword">import</span> { glimmer } <span class="hljs-keyword">from</span> <span class="hljs-string">'highlightjs-glimmer'</span>;
<span class="hljs-keyword">import</span> { common } <span class="hljs-keyword">from</span> <span class="hljs-string">'lowlight'</span>;

<span class="hljs-keyword">const</span> rehypePlugins = [
  [
    highlight,
    {
      <span class="hljs-attr">languages</span>: { ...common, glimmer, <span class="hljs-attr">hbs</span>: glimmer, <span class="hljs-attr">handlebars</span>: glimmer },
      <span class="hljs-attr">aliases</span>: { <span class="hljs-attr">javascript</span>: [<span class="hljs-string">'gjs'</span>], <span class="hljs-attr">typescript</span>: [<span class="hljs-string">'gts'</span>] },
    },
  ],
];
</code></pre>
<blockquote>
<p><strong><code>languages</code> replaces the defaults, it does not extend them.</strong>
<code>rehype-highlight</code> uses <code>options.languages || common</code>, so passing your own map
silently turns off highlighting for every other language. Spread lowlight's
<code>common</code> back in (add <code>lowlight</code> as a dependency to import it).</p>
</blockquote>
<p>If your app also depends on <code>highlight.js</code> directly, leave that dependency
alone — <code>rehype-highlight</code> brings its own copy through <code>lowlight</code>.</p>
<h3 id="staticassetspath"><a href="#staticassetspath"><code>staticAssetsPath</code></a></h3>
<p>• <strong>staticAssetsPath</strong>? : <em>string</em> - The static asset path to be used in the URL. Assets such as images are considered static.</p>
<p><strong><code>default</code></strong> "/assets/docfy"</p>
<h3 id="tocmaxdepth"><a href="#tocmaxdepth"><code>tocMaxDepth</code></a></h3>
<p>• <strong>tocMaxDepth</strong>? : <em>number</em> - The max depth of headings</p>
<p><strong><code>default</code></strong> 6</p>
<h3 id="sections"><a href="#sections"><code>sections</code></a></h3>
<p>• <strong>sections</strong>? : <em>Record‹string, SectionConfig›</em> - Configuration for documentation sections (folders).</p>
<p>This allows you to set custom labels and control the order of sections in your documentation navigation.</p>
<p>Example:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">const</span> config = {
  <span class="hljs-attr">sections</span>: {
    <span class="hljs-string">'getting-started'</span>: { <span class="hljs-attr">label</span>: <span class="hljs-string">'Getting Started'</span>, <span class="hljs-attr">order</span>: <span class="hljs-number">1</span> },
    <span class="hljs-attr">api</span>: { <span class="hljs-attr">label</span>: <span class="hljs-string">'API Reference'</span>, <span class="hljs-attr">order</span>: <span class="hljs-number">2</span> },
    <span class="hljs-attr">guides</span>: { <span class="hljs-attr">label</span>: <span class="hljs-string">'Guides'</span>, <span class="hljs-attr">order</span>: <span class="hljs-number">3</span> },
    <span class="hljs-attr">examples</span>: { <span class="hljs-attr">label</span>: <span class="hljs-string">'Examples'</span> }, <span class="hljs-comment">// No order, will be alphabetically sorted</span>
  },
};
</code></pre>
<h4 id="sectionconfig"><a href="#sectionconfig"><code>SectionConfig</code></a></h4>
<ul>
<li><strong>label</strong>? : <em>string</em> - Custom label for the section. If not provided, the folder name will be used.</li>
<li><strong>order</strong>? : <em>number</em> - Order of the section. Sections with lower order values appear first. Sections without an order value will be sorted alphabetically and appear after ordered sections.</li>
</ul>
<h4 id="ordering-behavior"><a href="#ordering-behavior">Ordering Behavior</a></h4>
<ul>
<li>Sections with an <code>order</code> value are sorted numerically (lowest first)</li>
<li>Sections without an <code>order</code> value are sorted alphabetically by label</li>
<li>Ordered sections always appear before unordered sections</li>
<li>Works with nested sections - the configuration applies to all levels</li>
</ul>
<h3 id="labels-deprecated"><a href="#labels-deprecated"><code>labels</code> (deprecated)</a></h3>
<p>• <strong>labels</strong>? : <em>Record‹string, string›</em> - Labels to be used while generating <code>nestedPageMetadata</code>.</p>
<p><strong>Note:</strong> This option is deprecated. Use <code>sections</code> instead for more control over section ordering and labels.</p>
<h3 id="repository"><a href="#repository"><code>repository</code></a></h3>
<p>• <strong>repository</strong>? : <em>RepositoryConfig</em> - The repository config.</p>
<p>Example:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">const</span> config = {
  <span class="hljs-attr">repository</span>: {
    <span class="hljs-attr">url</span>: <span class="hljs-string">'https://github.com/josemarluedke/docfy'</span>,
    <span class="hljs-attr">editBranch</span>: <span class="hljs-string">'main'</span>,
  },
};
</code></pre>
<h4 id="repositoryconfig"><a href="#repositoryconfig"><code>RepositoryConfig</code></a></h4>
<ul>
<li><strong>url</strong>: <em>string</em> - The URL to the Git Repository, for example: <code>https://github.com/josemarluedke/docfy</code></li>
<li><strong>editBranch</strong>? : <em>string</em> - Branch used to edit your markdown when clicking
on an "Edit this page" link. <strong>defaults to <code>"master"</code></strong></li>
</ul>
<h2 id="source-configuration"><a href="#source-configuration">Source Configuration</a></h2>
<p>Here you specify where your markdown content should come from. Additionally, you can setup options for the URLs and overwrite the base repository config.
Below you can see an example of how to pass these options to Docfy.</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// ...</span>
docfy
  .<span class="hljs-title function_">run</span>([
    {
      <span class="hljs-attr">root</span>: __dirname,
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">ignore</span>: [<span class="hljs-string">'private/**'</span>],
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
      <span class="hljs-attr">urlSchema</span>: <span class="hljs-string">'manual'</span>,
    },
  ])
  .<span class="hljs-title function_">then</span>(<span class="hljs-function"><span class="hljs-params">result</span> =></span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(result);
  });
</code></pre>
<h3 id="root"><a href="#root">root</a></h3>
<p>• <strong>root</strong>: <em>string</em></p>
<p>This option specifies the absolute path indicating where to search for markdown files.</p>
<h3 id="pattern"><a href="#pattern"><code>pattern</code></a></h3>
<p>• <strong>pattern</strong>: <em>string</em></p>
<p>Match files using the patterns the shell uses, like stars and stuff.</p>
<h3 id="ignore"><a href="#ignore"><code>ignore</code></a></h3>
<p>• <strong>ignore</strong>? : <em>string[]</em></p>
<p>List of files to ignore, it can be a specific file or a pattern.</p>
<h3 id="urlprefix"><a href="#urlprefix"><code>urlPrefix</code></a></h3>
<p>• <strong>urlPrefix</strong>? : <em>string</em></p>
<p>The prefix for URLs.</p>
<p>For example:
<code>docs</code> will generate URls like <code>/docs/something</code>
<code>blog</code> will generate urls like <code>/blog/something</code></p>
<h3 id="urlsuffix"><a href="#urlsuffix"><code>urlSuffix</code></a></h3>
<p>• <strong>urlSuffix</strong>? : <em>string</em></p>
<p>The suffix the URLs.</p>
<p>For example:
<code>.html</code> will generate urls like <code>/something.html</code></p>
<h3 id="urlschema"><a href="#urlschema"><code>urlSchema</code></a></h3>
<p>• <strong>urlSchema</strong>? : <em>"auto" | "manual"</em></p>
<p>Indicates how the URLs are generated.</p>
<ol>
<li>
<p><strong><code>auto</code></strong>: Uses the folder structure to inform how the URLs structure.
For example, if you have the following files:</p>
<pre><code>- install.md
- components/
  - button.md
  - card.md
</code></pre>
<p>The URLs would look like this, (assuming <code>urlPrefix</code> is set to <code>docs</code>).</p>
<pre><code>- docs/install
- docs/components/buttons
- docs/components/card
</code></pre>
</li>
<li>
<p><strong><code>manual</code></strong>: It uses Front Matter information to inform "category" and
"subcategory" of the file, ignoring the original file location.
Resulting in the following schema: <code>{category}/{subcategory}/{file-name}</code></p>
<p>If no category or subcategory is specified, all files will be at the root level. This option is perfect for documenting monorepo projects to keep
documentation files next to its implementation.</p>
</li>
</ol>
<h3 id="repository-1"><a href="#repository-1">repository</a></h3>
<p>• <strong>repository</strong>? : <em>RepositoryConfig</em></p>
<p>Overwrite base repository config for this source.</p>
</template>