import { DocfyLink } from '@docfy/ember';

<template>
  <h1 id="ember-cli"><a href="#ember-cli">Ember CLI</a></h1>
<p><code>@docfy/ember-cli</code> provides classic Ember CLI integration for Docfy. Choose this integration for traditional Ember applications with full static site generation support.</p>
<h2 id="prerequisites"><a href="#prerequisites">Prerequisites</a></h2>
<ul>
<li>Classic Ember CLI application</li>
<li>Node <code>>=22.22.2</code></li>
<li><code>@docfy/ember</code> for runtime components (covered in <DocfyLink @to="/docs/ember/tutorial"  >Tutorial</DocfyLink>)</li>
</ul>
<h2 id="installation"><a href="#installation">Installation</a></h2>
<pre><code class="hljs language-bash">npm install --save-dev @docfy/ember-cli
</code></pre>
<h2 id="configuration-file"><a href="#configuration-file">Configuration File</a></h2>
<p>Create <code>.docfy-config.js</code> in your project root (note the dot prefix):</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">const</span> path = <span class="hljs-built_in">require</span>(<span class="hljs-string">'path'</span>);

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-attr">sources</span>: [
    {
      <span class="hljs-attr">root</span>: path.<span class="hljs-title function_">join</span>(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
    },
  ],
};
</code></pre>
<p><code>.docfy-config.js</code>, <code>.docfy-config.mjs</code> and <code>.docfy-config.cjs</code> are all
supported, and the file is loaded synchronously either way — Node's support for
<code>require()</code> of ES modules means the classic build no longer has to care which
module format you picked.</p>
<p>The same applies to the plugins you load from it. Most of the remark/rehype
ecosystem is ESM-only these days, and a CommonJS config can <code>require()</code> those
plugins directly; <code>require()</code> returns the module namespace, so reach for
<code>.default</code>:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// .docfy-config.js</span>
<span class="hljs-keyword">const</span> path = <span class="hljs-built_in">require</span>(<span class="hljs-string">'path'</span>);
<span class="hljs-keyword">const</span> highlight = <span class="hljs-built_in">require</span>(<span class="hljs-string">'rehype-highlight'</span>).<span class="hljs-property">default</span>;
<span class="hljs-keyword">const</span> autolinkHeadings = <span class="hljs-built_in">require</span>(<span class="hljs-string">'rehype-autolink-headings'</span>).<span class="hljs-property">default</span>;

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-attr">rehypePlugins</span>: [[autolinkHeadings, { <span class="hljs-attr">behavior</span>: <span class="hljs-string">'wrap'</span> }], highlight],
  <span class="hljs-attr">sources</span>: [
    {
      <span class="hljs-attr">root</span>: path.<span class="hljs-title function_">join</span>(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
    },
  ],
};
</code></pre>
<p>Or the same thing as ESM, where imports need no unwrapping:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// .docfy-config.mjs</span>
<span class="hljs-keyword">import</span> path <span class="hljs-keyword">from</span> <span class="hljs-string">'path'</span>;
<span class="hljs-keyword">import</span> highlight <span class="hljs-keyword">from</span> <span class="hljs-string">'rehype-highlight'</span>;
<span class="hljs-keyword">import</span> autolinkHeadings <span class="hljs-keyword">from</span> <span class="hljs-string">'rehype-autolink-headings'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  <span class="hljs-attr">rehypePlugins</span>: [[autolinkHeadings, { <span class="hljs-attr">behavior</span>: <span class="hljs-string">'wrap'</span> }], highlight],
  <span class="hljs-attr">sources</span>: [
    {
      <span class="hljs-attr">root</span>: path.<span class="hljs-title function_">join</span>(<span class="hljs-keyword">import</span>.<span class="hljs-property">meta</span>.<span class="hljs-property">dirname</span>, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
    },
  ],
};
</code></pre>
<blockquote>
<p><strong>The one limitation</strong>: a config using <strong>top-level <code>await</code></strong> cannot be loaded,
because Ember CLI's build is synchronous. Docfy fails with an explicit message
if you try. Move the async work into a Docfy plugin, or use
<DocfyLink @to="/docs/ember/ember-vite"  >@docfy/ember-vite</DocfyLink>, which loads the config asynchronously.</p>
</blockquote>
<h3 id="syntax-highlighting"><a href="#syntax-highlighting">Syntax highlighting</a></h3>
<p>Highlighting runs as a rehype plugin. Combining <code>rehype-highlight</code> with
<a href="https://github.com/NullVoxPopuli/highlightjs-glimmer"><code>highlightjs-glimmer</code></a>
gives real <code>gjs</code>/<code>gts</code>/<code>hbs</code> highlighting instead of the handlebars grammar:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// .docfy-config.js</span>
<span class="hljs-keyword">const</span> highlight = <span class="hljs-built_in">require</span>(<span class="hljs-string">'rehype-highlight'</span>).<span class="hljs-property">default</span>;
<span class="hljs-keyword">const</span> { glimmer } = <span class="hljs-built_in">require</span>(<span class="hljs-string">'highlightjs-glimmer'</span>);
<span class="hljs-keyword">const</span> { common } = <span class="hljs-built_in">require</span>(<span class="hljs-string">'lowlight'</span>);

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-attr">rehypePlugins</span>: [
    [
      highlight,
      {
        <span class="hljs-comment">// `languages` replaces rehype-highlight's defaults rather than</span>
        <span class="hljs-comment">// extending them, so spread lowlight's `common` back in.</span>
        <span class="hljs-attr">languages</span>: { ...common, glimmer, <span class="hljs-attr">hbs</span>: glimmer, <span class="hljs-attr">handlebars</span>: glimmer },
        <span class="hljs-attr">aliases</span>: { <span class="hljs-attr">javascript</span>: [<span class="hljs-string">'gjs'</span>], <span class="hljs-attr">typescript</span>: [<span class="hljs-string">'gts'</span>] },
      },
    ],
  ],
  <span class="hljs-comment">// ...</span>
};
</code></pre>
<p>Docfy escapes <code>\{{</code> inside code blocks for you, after highlighting has run, so
the highlighted markup does not get parsed as a mustache by Ember's template
compiler. You do not need <code>remarkHbsOptions.escapeCurliesCode</code> for this — Docfy
manages that option itself.</p>
<h2 id="ember-cli-specific-features"><a href="#ember-cli-specific-features">Ember CLI-Specific Features</a></h2>
<h3 id="build-time-processing"><a href="#build-time-processing">Build-time Processing</a></h3>
<p>All markdown processing happens during the Ember CLI build phase. This means:</p>
<ul>
<li><strong>Static generation</strong> - All routes and content are generated at build time</li>
<li><strong>Bundle optimization</strong> - Processed content is included in your app bundle</li>
<li><strong>No runtime processing</strong> - Fast page loads since everything is pre-built</li>
</ul>
<h3 id="preview-templates"><a href="#preview-templates">Preview Templates</a></h3>
<p>Ember CLI integration supports a special <code>preview-template</code> syntax for quick demos:</p>
<pre><code class="hljs language-md"><span class="hljs-section"># Quick Button Demo</span>

<span class="hljs-code">```hbs preview-template
&#x3C;Button @variant='primary' @onClick=\{{this.handleClick}}>
  Click me!
&#x3C;/Button>
```</span>
</code></pre>
<p>This creates a demo component with an empty Glimmer component class, perfect for simple examples.</p>
<h3 id="static-site-generation-with-prember"><a href="#static-site-generation-with-prember">Static Site Generation with Prember</a></h3>
<p>Generate fully static documentation sites that work without JavaScript:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// ember-cli-build.js</span>
<span class="hljs-keyword">const</span> { <span class="hljs-title class_">Webpack</span> } = <span class="hljs-built_in">require</span>(<span class="hljs-string">'@embroider/webpack'</span>);

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = <span class="hljs-keyword">function</span> (<span class="hljs-params">defaults</span>) {
  <span class="hljs-keyword">const</span> app = <span class="hljs-keyword">new</span> <span class="hljs-title class_">EmberApp</span>(defaults, {
    <span class="hljs-comment">// ... your app config</span>
  });

  <span class="hljs-comment">// Add prember for static site generation</span>
  <span class="hljs-keyword">return</span> <span class="hljs-built_in">require</span>(<span class="hljs-string">'prember'</span>).<span class="hljs-title function_">prerender</span>(app, {
    <span class="hljs-attr">urls</span>: [
      <span class="hljs-string">'/docs'</span>,
      <span class="hljs-string">'/docs/installation'</span>,
      <span class="hljs-string">'/docs/components/button'</span>,
      <span class="hljs-comment">// Add all your documentation URLs</span>
    ],
  });
};
</code></pre>
<p>This generates static HTML files that can be deployed to any CDN or static hosting service.</p>
<h2 id="advanced-configuration"><a href="#advanced-configuration">Advanced Configuration</a></h2>
<h3 id="ember-cli-build-integration"><a href="#ember-cli-build-integration">Ember CLI Build Integration</a></h3>
<p>The addon automatically integrates with your Ember CLI build process. No additional configuration needed for basic usage.</p>
<h3 id="custom-processing"><a href="#custom-processing">Custom Processing</a></h3>
<p>Add custom Docfy plugins for specialized processing:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// .docfy-config.js</span>
<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-attr">plugins</span>: [
    <span class="hljs-comment">// Custom processing plugins</span>
    <span class="hljs-built_in">require</span>(<span class="hljs-string">'./lib/my-custom-plugin'</span>),
  ],
  <span class="hljs-attr">sources</span>: [
    {
      <span class="hljs-attr">root</span>: path.<span class="hljs-title function_">join</span>(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
    },
  ],
};
</code></pre>
<h3 id="monorepo-support"><a href="#monorepo-support">Monorepo Support</a></h3>
<p>Perfect for monorepos where you want to collect docs from multiple packages:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// .docfy-config.js</span>
<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-attr">sources</span>: [
    <span class="hljs-comment">// Main documentation</span>
    {
      <span class="hljs-attr">root</span>: path.<span class="hljs-title function_">join</span>(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
    },
    <span class="hljs-comment">// Package-specific docs</span>
    {
      <span class="hljs-attr">root</span>: path.<span class="hljs-title function_">join</span>(__dirname, <span class="hljs-string">'packages'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/docs/**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'packages'</span>,
      <span class="hljs-attr">urlSchema</span>: <span class="hljs-string">'manual'</span>,
    },
  ],
};
</code></pre>
<h3 id="build-performance"><a href="#build-performance">Build Performance</a></h3>
<p>For large documentation sites, you can optimize build performance:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// ember-cli-build.js</span>
<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = <span class="hljs-keyword">function</span> (<span class="hljs-params">defaults</span>) {
  <span class="hljs-keyword">const</span> app = <span class="hljs-keyword">new</span> <span class="hljs-title class_">EmberApp</span>(defaults, {
    <span class="hljs-comment">// Disable source maps in development for faster builds</span>
    <span class="hljs-attr">sourcemaps</span>: {
      <span class="hljs-attr">enabled</span>: <span class="hljs-literal">false</span>,
    },
  });

  <span class="hljs-keyword">return</span> app;
};
</code></pre>
<p>All configuration options from <DocfyLink @to="/docs/configuration"  >@docfy/core</DocfyLink> are supported.</p>
</template>