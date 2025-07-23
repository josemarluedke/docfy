import { DocfyLink } from '@docfy/ember';

<template>
  <h1 id="ember-vite"><a href="#ember-vite">Ember Vite</a></h1>
<p><code>@docfy/ember-vite</code> provides modern Vite integration for Docfy with Ember applications using <code>@embroider/vite</code>. Choose this integration for lightning-fast development builds with hot module replacement.</p>
<h2 id="prerequisites"><a href="#prerequisites">Prerequisites</a></h2>
<ul>
<li><code>@embroider/vite</code> configured in your Ember app</li>
<li><code>@docfy/ember</code> for runtime components (covered in <DocfyLink @to="/docs/ember/tutorial"  >Tutorial</DocfyLink>)</li>
</ul>
<h2 id="installation"><a href="#installation">Installation</a></h2>
<pre><code class="hljs language-bash">npm install --save-dev @docfy/ember-vite</code></pre>
<h2 id="configuration"><a href="#configuration">Configuration</a></h2>
<h3 id="inline-configuration"><a href="#inline-configuration">Inline Configuration</a></h3>
<p>Add the Docfy plugin directly to your <code>vite.config.mjs</code>:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> { defineConfig } <span class="hljs-keyword">from</span> <span class="hljs-string">'vite'</span>;
<span class="hljs-keyword">import</span> { docfyVite } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-vite'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> defineConfig({
  <span class="hljs-attr">plugins</span>: [
    <span class="hljs-comment">// ... other Embroider plugins</span>
    docfyVite({
      <span class="hljs-attr">sources</span>: [
        {
          <span class="hljs-attr">root</span>: path.resolve(__dirname, <span class="hljs-string">'docs'</span>),
          <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
          <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
        },
      ],
    }),
  ],
});</code></pre>
<h3 id="configuration-file"><a href="#configuration-file">Configuration File</a></h3>
<p>For better organization, use a separate configuration file. Create <code>docfy.config.js</code> or <code>docfy.config.mjs</code>:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// docfy.config.js</span>
<span class="hljs-keyword">const</span> path = <span class="hljs-built_in">require</span>(<span class="hljs-string">'path'</span>);

<span class="hljs-built_in">module</span>.exports = {
  <span class="hljs-attr">sources</span>: [
    {
      <span class="hljs-attr">root</span>: path.join(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
    },
  ],
  <span class="hljs-attr">remarkPlugins</span>: [
    <span class="hljs-comment">// Add remark plugins</span>
  ],
  <span class="hljs-attr">repository</span>: {
    <span class="hljs-attr">url</span>: <span class="hljs-string">'https://github.com/username/repo'</span>,
    <span class="hljs-attr">editBranch</span>: <span class="hljs-string">'main'</span>,
  },
};</code></pre>
<p>Then use it in your Vite config:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> { defineConfig } <span class="hljs-keyword">from</span> <span class="hljs-string">'vite'</span>;
<span class="hljs-keyword">import</span> { docfyVite } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-vite'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> defineConfig({
  <span class="hljs-attr">plugins</span>: [
    <span class="hljs-comment">// ... other Embroider plugins</span>
    docfyVite(), <span class="hljs-comment">// Automatically loads docfy.config.js/mjs</span>
  ],
});</code></pre>
<h3 id="custom-config-file-path"><a href="#custom-config-file-path">Custom Config File Path</a></h3>
<p>Specify a custom configuration file location:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> { defineConfig } <span class="hljs-keyword">from</span> <span class="hljs-string">'vite'</span>;
<span class="hljs-keyword">import</span> { docfyVite } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-vite'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> defineConfig({
  <span class="hljs-attr">plugins</span>: [
    docfyVite({
      <span class="hljs-attr">configFile</span>: <span class="hljs-string">'config/my-docfy.config.js'</span>,
    }),
  ],
});</code></pre>
<h3 id="plugin-options"><a href="#plugin-options">Plugin Options</a></h3>
<p>The plugin accepts these options:</p>
<pre><code class="hljs language-js">docfyVite({
  <span class="hljs-comment">// Path to config file (optional)</span>
  <span class="hljs-attr">configFile</span>: <span class="hljs-string">'docfy.config.js'</span>, <span class="hljs-comment">// default: 'docfy.config.js' or 'docfy.config.mjs'</span>

  <span class="hljs-comment">// Root directory (optional)</span>
  <span class="hljs-attr">root</span>: process.cwd(), <span class="hljs-comment">// default: process.cwd()</span>

  <span class="hljs-comment">// Enable HMR (optional)</span>
  <span class="hljs-attr">hmr</span>: <span class="hljs-literal">true</span>, <span class="hljs-comment">// default: true</span>

  <span class="hljs-comment">// Inline config (optional) - overrides config file</span>
  <span class="hljs-attr">config</span>: {
    <span class="hljs-attr">sources</span>: [
      <span class="hljs-comment">/* ... */</span>
    ],
    <span class="hljs-comment">// ... other docfy options</span>
  },

  <span class="hljs-comment">// Or any @docfy/core options directly</span>
  <span class="hljs-attr">sources</span>: [
    <span class="hljs-comment">/* ... */</span>
  ],
  <span class="hljs-attr">remarkPlugins</span>: [
    <span class="hljs-comment">/* ... */</span>
  ],
  <span class="hljs-comment">// ...</span>
});</code></pre>
<h2 id="vite-specific-features"><a href="#vite-specific-features">Vite-Specific Features</a></h2>
<h3 id="hot-module-replacement-hmr"><a href="#hot-module-replacement-hmr">Hot Module Replacement (HMR)</a></h3>
<p>The killer feature of the Vite integration is instant updates. Edit any markdown file and see changes reflected immediately in the browser without page reloads:</p>
<pre><code class="hljs language-bash"><span class="hljs-comment"># Edit docs/my-component.md</span>
<span class="hljs-comment"># Browser updates instantly ⚡</span></code></pre>
<h3 id="development-performance"><a href="#development-performance">Development Performance</a></h3>
<ul>
<li><strong>On-demand processing</strong> - Only processes markdown files when requested</li>
<li><strong>Incremental builds</strong> - Only reprocesses changed files</li>
<li><strong>Fast startup</strong> - No need to process all docs during development server start</li>
</ul>
<h3 id="virtual-module-integration"><a href="#virtual-module-integration">Virtual Module Integration</a></h3>
<p>Access processed data through Embroider's virtual module system:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> { getDocfyOutput } <span class="hljs-keyword">from</span> <span class="hljs-string">'@embroider/virtual/docfy/output'</span>;

<span class="hljs-keyword">const</span> docfyData = getDocfyOutput();</code></pre>
<h2 id="advanced-configuration"><a href="#advanced-configuration">Advanced Configuration</a></h2>
<h3 id="multiple-sources"><a href="#multiple-sources">Multiple Sources</a></h3>
<p>Configure multiple documentation sources with different URL schemas:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// docfy.config.js</span>
<span class="hljs-built_in">module</span>.exports = {
  <span class="hljs-attr">sources</span>: [
    {
      <span class="hljs-attr">root</span>: path.join(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
      <span class="hljs-attr">urlSchema</span>: <span class="hljs-string">'auto'</span>,
    },
    {
      <span class="hljs-attr">root</span>: path.join(__dirname, <span class="hljs-string">'guides'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'guides'</span>,
      <span class="hljs-attr">urlSchema</span>: <span class="hljs-string">'manual'</span>,
    },
  ],
};</code></pre>
<h3 id="development-vs-production"><a href="#development-vs-production">Development vs Production</a></h3>
<p><strong>Development:</strong> Files processed on-demand for maximum speed
<strong>Production:</strong> All files processed during build for optimization</p>
<pre><code class="hljs language-bash"><span class="hljs-comment"># Development - instant HMR</span>
npm run start

<span class="hljs-comment"># Production - full processing</span>
npm run build</code></pre>
<p>All <DocfyLink @to="/docs/configuration"  >core configuration options</DocfyLink> are supported.</p>
<h2 id="typescript-support"><a href="#typescript-support">TypeScript Support</a></h2>
<p>Get full type safety in JavaScript using JSDoc annotations:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> { defineConfig } <span class="hljs-keyword">from</span> <span class="hljs-string">'vite'</span>;
<span class="hljs-keyword">import</span> { docfyVite } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-vite'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> defineConfig({
  <span class="hljs-attr">plugins</span>: [
    docfyVite(
      <span class="hljs-comment">/** <span class="hljs-doctag">@type <span class="hljs-type">{import('@docfy/ember-vite').DocfyViteOptions}</span> </span>*/</span>
      ({
        <span class="hljs-attr">sources</span>: [
          {
            <span class="hljs-attr">root</span>: path.resolve(__dirname, <span class="hljs-string">'docs'</span>),
            <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
            <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
          },
        ],
      })
    ),
  ],
});</code></pre>
<p>Or for TypeScript projects:</p>
<pre><code class="hljs language-ts"><span class="hljs-keyword">import</span> <span class="hljs-keyword">type</span> { DocfyViteOptions } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-vite'</span>;
<span class="hljs-keyword">import</span> { defineConfig } <span class="hljs-keyword">from</span> <span class="hljs-string">'vite'</span>;
<span class="hljs-keyword">import</span> { docfyVite } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-vite'</span>;

<span class="hljs-keyword">const</span> config: DocfyViteOptions = {
  <span class="hljs-attr">sources</span>: [
    <span class="hljs-comment">// fully typed configuration</span>
  ],
};

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> defineConfig({
  <span class="hljs-attr">plugins</span>: [docfyVite(config)],
});</code></pre>
</template>