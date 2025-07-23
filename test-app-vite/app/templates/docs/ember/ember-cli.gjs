import { DocfyLink } from '@docfy/ember';

<template>
  <h1 id="ember-cli"><a href="#ember-cli">Ember CLI</a></h1>
<p><code>@docfy/ember-cli</code> provides classic Ember CLI integration for Docfy. Choose this integration for traditional Ember applications with full static site generation support.</p>
<h2 id="prerequisites"><a href="#prerequisites">Prerequisites</a></h2>
<ul>
<li>Classic Ember CLI application</li>
<li><code>@docfy/ember</code> for runtime components (covered in <DocfyLink @to="/docs/ember/tutorial"  >Tutorial</DocfyLink>)</li>
</ul>
<h2 id="installation"><a href="#installation">Installation</a></h2>
<pre><code class="hljs language-bash">npm install --save-dev @docfy/ember-cli</code></pre>
<h2 id="configuration-file"><a href="#configuration-file">Configuration File</a></h2>
<p>Create <code>.docfy-config.js</code> in your project root (note the dot prefix):</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">const</span> path = <span class="hljs-built_in">require</span>(<span class="hljs-string">'path'</span>);

<span class="hljs-built_in">module</span>.exports = {
  <span class="hljs-attr">sources</span>: [
    {
      <span class="hljs-attr">root</span>: path.join(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
    },
  ],
};</code></pre>
<blockquote>
<p><strong>Note</strong>: Ember CLI integration only supports CommonJS format (<code>.js</code> files with <code>module.exports</code>). ESM configuration files (<code>.mjs</code>) are not supported due to Ember CLI's synchronous build process. For ESM config support, consider using <DocfyLink @to="/docs/ember/ember-vite"  >@docfy/ember-vite</DocfyLink> instead.</p>
</blockquote>
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
```</span></code></pre>
<p>This creates a demo component with an empty Glimmer component class, perfect for simple examples.</p>
<h3 id="static-site-generation-with-prember"><a href="#static-site-generation-with-prember">Static Site Generation with Prember</a></h3>
<p>Generate fully static documentation sites that work without JavaScript:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// ember-cli-build.js</span>
<span class="hljs-keyword">const</span> { Webpack } = <span class="hljs-built_in">require</span>(<span class="hljs-string">'@embroider/webpack'</span>);

<span class="hljs-built_in">module</span>.exports = <span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params">defaults</span>) </span>{
  <span class="hljs-keyword">const</span> app = <span class="hljs-keyword">new</span> EmberApp(defaults, {
    <span class="hljs-comment">// ... your app config</span>
  });

  <span class="hljs-comment">// Add prember for static site generation</span>
  <span class="hljs-keyword">return</span> <span class="hljs-built_in">require</span>(<span class="hljs-string">'prember'</span>).prerender(app, {
    <span class="hljs-attr">urls</span>: [
      <span class="hljs-string">'/docs'</span>,
      <span class="hljs-string">'/docs/installation'</span>,
      <span class="hljs-string">'/docs/components/button'</span>,
      <span class="hljs-comment">// Add all your documentation URLs</span>
    ],
  });
};</code></pre>
<p>This generates static HTML files that can be deployed to any CDN or static hosting service.</p>
<h2 id="advanced-configuration"><a href="#advanced-configuration">Advanced Configuration</a></h2>
<h3 id="ember-cli-build-integration"><a href="#ember-cli-build-integration">Ember CLI Build Integration</a></h3>
<p>The addon automatically integrates with your Ember CLI build process. No additional configuration needed for basic usage.</p>
<h3 id="custom-processing"><a href="#custom-processing">Custom Processing</a></h3>
<p>Add custom Docfy plugins for specialized processing:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// .docfy-config.js</span>
<span class="hljs-built_in">module</span>.exports = {
  <span class="hljs-attr">plugins</span>: [
    <span class="hljs-comment">// Custom processing plugins</span>
    <span class="hljs-built_in">require</span>(<span class="hljs-string">'./lib/my-custom-plugin'</span>),
  ],
  <span class="hljs-attr">sources</span>: [
    {
      <span class="hljs-attr">root</span>: path.join(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
    },
  ],
};</code></pre>
<h3 id="monorepo-support"><a href="#monorepo-support">Monorepo Support</a></h3>
<p>Perfect for monorepos where you want to collect docs from multiple packages:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// .docfy-config.js</span>
<span class="hljs-built_in">module</span>.exports = {
  <span class="hljs-attr">sources</span>: [
    <span class="hljs-comment">// Main documentation</span>
    {
      <span class="hljs-attr">root</span>: path.join(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
    },
    <span class="hljs-comment">// Package-specific docs</span>
    {
      <span class="hljs-attr">root</span>: path.join(__dirname, <span class="hljs-string">'packages'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/docs/**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'packages'</span>,
      <span class="hljs-attr">urlSchema</span>: <span class="hljs-string">'manual'</span>,
    },
  ],
};</code></pre>
<h3 id="build-performance"><a href="#build-performance">Build Performance</a></h3>
<p>For large documentation sites, you can optimize build performance:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// ember-cli-build.js</span>
<span class="hljs-built_in">module</span>.exports = <span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params">defaults</span>) </span>{
  <span class="hljs-keyword">const</span> app = <span class="hljs-keyword">new</span> EmberApp(defaults, {
    <span class="hljs-comment">// Disable source maps in development for faster builds</span>
    <span class="hljs-attr">sourcemaps</span>: {
      <span class="hljs-attr">enabled</span>: <span class="hljs-literal">false</span>,
    },
  });

  <span class="hljs-keyword">return</span> app;
};</code></pre>
<p>All configuration options from <a href="../../configuration.md">@docfy/core</a> are supported.</p>
</template>