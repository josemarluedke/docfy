<template>
  <h1 id="configuration">Configuration</h1>
<p>Docfy has a few options you can change to enhance and, or modify Docfy behavior. There are two categories of options, first, base configuration, and second, the source of files configuration.</p>
<h2 id="base-configuration">Base configuration</h2>
<p>Here you can customize the base options, such as the Docfy plugins, remark
plugins, rehype plugins, the git repository URL, and more.
Below you can see an example of how to pass these options to Docfy.</p>
<pre><code class="language-js">const Docfy = require('@docfy/core');

const docfy = new Docfy({
  plugins: [],
  remarkPlugins: [],
  rehypePlugins: [],
  staticAssetsPath: '/assets/docfy',
  tocMaxDepth: 6,
  repository: {
    url: 'https://github.com/josemarluedke/docfy'
  }
});
</code></pre>
<h3 id="plugins"><code>plugins</code></h3>
<p>• <strong>plugins</strong>? : <em>Plugin[]</em> - A list of Docfy plugins.</p>
<h3 id="remarkplugins"><code>remarkPlugins</code></h3>
<p>• <strong>remarkPlugins</strong>? : <em>function | [function, RemarkPluginOptions][]</em> - Additional remark plugins</p>
<p>Example:</p>
<pre><code class="language-js">const hbs = require('remark-hbs');
const autolinkHeadings = require('remark-autolink-headings');

const remarkPlugins = [autolinkHeadings, hbs];

//...
</code></pre>
<p>In case the plugin has options, you can specify as the example below:</p>
<pre><code class="language-js">// ..
const remarkPlugins = [
  [
    autolinkHeadings,
    {
      behavior: 'wrap'
    }
  ]
];
</code></pre>
<h3 id="rehypeplugins"><code>rehypePlugins</code></h3>
<p>• <strong>rehypePlugins</strong>? : <em>function | [function, RehypePluginOptions][]</em> - Additional rehype plugins</p>
<p>You can also pass options to rehype plugins the same way as remark plugins.</p>
<h3 id="staticassetspath"><code>staticAssetsPath</code></h3>
<p>• <strong>staticAssetsPath</strong>? : <em>string</em> - The static asset path to be used in the URL. Assets such as images are considered static.</p>
<p><strong><code>default</code></strong> "/assets/docfy"</p>
<h3 id="tocmaxdepth"><code>tocMaxDepth</code></h3>
<p>• <strong>tocMaxDepth</strong>? : <em>number</em> - The max depth of headings</p>
<p><strong><code>default</code></strong> 6</p>
<h3 id="labels"><code>labels</code></h3>
<p>• <strong>labels</strong>? : <em>Record‹string, string›</em> - Labels to be used while generating <code>nestedPageMetadata</code>.</p>
<h3 id="repository"><code>repository</code></h3>
<p>• <strong>repository</strong>? : <em>RepositoryConfig</em> - The repository config.</p>
<p>Example:</p>
<pre><code class="language-js">const config = {
  repository: {
    url: 'https://github.com/josemarluedke/docfy',
    editBranch: 'main'
  }
};
</code></pre>
<h4 id="repositoryconfig"><code>RepositoryConfig</code></h4>
<ul>
<li><strong>url</strong>: <em>string</em> - The URL to the Git Repository, for example: <code>https://github.com/josemarluedke/docfy</code></li>
<li><strong>editBranch</strong>? : <em>string</em> - Branch used to edit your markdown when clicking
on an "Edit this page" link. <strong>defaults to <code>"master"</code></strong></li>
</ul>
<h2 id="source-configuration">Source Configuration</h2>
<p>Here you specify where your markdown content should come from. Additionally, you can setup options for the URLs and overwrite the base repository config.
Below you can see an example of how to pass these options to Docfy.</p>
<pre><code class="language-js">// ...
docfy
  .run([
    {
      root: __dirname,
      pattern: '**/*.md',
      ignore: ['private/**'],
      urlPrefix: 'docs',
      urlSchema: 'manual'
    }
  ])
  .then((result) => {
    console.log(result);
  });
</code></pre>
<h3 id="root">root</h3>
<p>• <strong>root</strong>: <em>string</em></p>
<p>This option specifies the absolute path indicating where to search for markdown files.</p>
<h3 id="pattern"><code>pattern</code></h3>
<p>• <strong>pattern</strong>: <em>string</em></p>
<p>Match files using the patterns the shell uses, like stars and stuff.</p>
<h3 id="ignore"><code>ignore</code></h3>
<p>• <strong>ignore</strong>? : <em>string[]</em></p>
<p>List of files to ignore, it can be a specific file or a pattern.</p>
<h3 id="urlprefix"><code>urlPrefix</code></h3>
<p>• <strong>urlPrefix</strong>? : <em>string</em></p>
<p>The prefix for URLs.</p>
<p>For example:
<code>docs</code> will generate URls like <code>/docs/something</code>
<code>blog</code> will generate urls like <code>/blog/something</code></p>
<h3 id="urlsuffix"><code>urlSuffix</code></h3>
<p>• <strong>urlSuffix</strong>? : <em>string</em></p>
<p>The suffix the URLs.</p>
<p>For example:
<code>.html</code> will generate urls like <code>/something.html</code></p>
<h3 id="urlschema"><code>urlSchema</code></h3>
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
<h3 id="repository-1">repository</h3>
<p>• <strong>repository</strong>? : <em>RepositoryConfig</em></p>
<p>Overwrite base repository config for this source.</p>
</template>