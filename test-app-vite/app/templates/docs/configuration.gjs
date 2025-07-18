<template>
  <h1 id="configuration"><a href="#configuration">Configuration</a></h1>
<p>Docfy has a few options you can change to enhance and, or modify Docfy behavior. There are two categories of options, first, base configuration, and second, the source of files configuration.</p>
<h2 id="base-configuration"><a href="#base-configuration">Base configuration</a></h2>
<p>Here you can customize the base options, such as the Docfy plugins, remark
plugins, rehype plugins, the git repository URL, and more.
Below you can see an example of how to pass these options to Docfy.</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">const</span> Docfy = <span class="hljs-built_in">require</span>(<span class="hljs-string">'@docfy/core'</span>);

<span class="hljs-keyword">const</span> docfy = <span class="hljs-keyword">new</span> Docfy({
  <span class="hljs-attr">plugins</span>: [],
  <span class="hljs-attr">remarkPlugins</span>: [],
  <span class="hljs-attr">rehypePlugins</span>: [],
  <span class="hljs-attr">staticAssetsPath</span>: <span class="hljs-string">'/assets/docfy'</span>,
  <span class="hljs-attr">tocMaxDepth</span>: <span class="hljs-number">6</span>,
  <span class="hljs-attr">repository</span>: {
    <span class="hljs-attr">url</span>: <span class="hljs-string">'https://github.com/josemarluedke/docfy'</span>
  }
});</code></pre>
<h3 id="plugins"><a href="#plugins"><code>plugins</code></a></h3>
<p>• <strong>plugins</strong>? : <em>Plugin[]</em> - A list of Docfy plugins.</p>
<h3 id="remarkplugins"><a href="#remarkplugins"><code>remarkPlugins</code></a></h3>
<p>• <strong>remarkPlugins</strong>? : <em>function | [function, RemarkPluginOptions][]</em> - Additional remark plugins</p>
<p>Example:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">const</span> hbs = <span class="hljs-built_in">require</span>(<span class="hljs-string">'remark-hbs'</span>);
<span class="hljs-keyword">const</span> autolinkHeadings = <span class="hljs-built_in">require</span>(<span class="hljs-string">'remark-autolink-headings'</span>);

<span class="hljs-keyword">const</span> remarkPlugins = [autolinkHeadings, hbs];

<span class="hljs-comment">//...</span></code></pre>
<p>In case the plugin has options, you can specify as the example below:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// ..</span>
<span class="hljs-keyword">const</span> remarkPlugins = [
  [
    autolinkHeadings,
    {
      <span class="hljs-attr">behavior</span>: <span class="hljs-string">'wrap'</span>
    }
  ]
];</code></pre>
<h3 id="rehypeplugins"><a href="#rehypeplugins"><code>rehypePlugins</code></a></h3>
<p>• <strong>rehypePlugins</strong>? : <em>function | [function, RehypePluginOptions][]</em> - Additional rehype plugins</p>
<p>You can also pass options to rehype plugins the same way as remark plugins.</p>
<h3 id="staticassetspath"><a href="#staticassetspath"><code>staticAssetsPath</code></a></h3>
<p>• <strong>staticAssetsPath</strong>? : <em>string</em> - The static asset path to be used in the URL. Assets such as images are considered static.</p>
<p><strong><code>default</code></strong> "/assets/docfy"</p>
<h3 id="tocmaxdepth"><a href="#tocmaxdepth"><code>tocMaxDepth</code></a></h3>
<p>• <strong>tocMaxDepth</strong>? : <em>number</em> - The max depth of headings</p>
<p><strong><code>default</code></strong> 6</p>
<h3 id="labels"><a href="#labels"><code>labels</code></a></h3>
<p>• <strong>labels</strong>? : <em>Record‹string, string›</em> - Labels to be used while generating <code>nestedPageMetadata</code>.</p>
<h3 id="repository"><a href="#repository"><code>repository</code></a></h3>
<p>• <strong>repository</strong>? : <em>RepositoryConfig</em> - The repository config.</p>
<p>Example:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">const</span> config = {
  <span class="hljs-attr">repository</span>: {
    <span class="hljs-attr">url</span>: <span class="hljs-string">'https://github.com/josemarluedke/docfy'</span>,
    <span class="hljs-attr">editBranch</span>: <span class="hljs-string">'main'</span>
  }
};</code></pre>
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
  .run([
    {
      <span class="hljs-attr">root</span>: __dirname,
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">ignore</span>: [<span class="hljs-string">'private/**'</span>],
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
      <span class="hljs-attr">urlSchema</span>: <span class="hljs-string">'manual'</span>
    }
  ])
  .then(<span class="hljs-function">(<span class="hljs-params">result</span>) =></span> {
    <span class="hljs-built_in">console</span>.log(result);
  });</code></pre>
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