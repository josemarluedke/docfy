<template>
  <h1 id="upgrade-guide"><a href="#upgrade-guide">Upgrade Guide</a></h1>
<p>This guide helps you upgrade between different versions of Docfy's Ember integration packages.</p>
<h2 id="upgrading-to-v010x"><a href="#upgrading-to-v010x">Upgrading to v0.10.x</a></h2>
<p>Version 0.10.0 introduced a major architectural change with the new package structure. This section helps you migrate from previous versions to the new modular architecture.</p>
<h3 id="package-structure-changes"><a href="#package-structure-changes">Package Structure Changes</a></h3>
<h4 id="previous-architecture"><a href="#previous-architecture">Previous Architecture</a></h4>
<pre><code>@docfy/ember - Single package with build integration + components
</code></pre>
<h4 id="new-architecture"><a href="#new-architecture">New Architecture</a></h4>
<pre><code>@docfy/ember - Runtime components only (v2 addon)
@docfy/ember-cli - Classic build integration + components
@docfy/ember-vite - Modern Vite integration + components
</code></pre>
<h3 id="migration-paths"><a href="#migration-paths">Migration Paths</a></h3>
<h4 id="from-docfyember-classic"><a href="#from-docfyember-classic">From @docfy/ember (Classic)</a></h4>
<p>If you were using <code>@docfy/ember</code> with classic Ember CLI builds:</p>
<h5 id="1-update-package-dependencies"><a href="#1-update-package-dependencies">1. Update Package Dependencies</a></h5>
<pre><code class="hljs language-bash"><span class="hljs-comment"># Install new packages</span>
npm install --save-dev @docfy/ember-cli</code></pre>
<p><strong>Important:</strong> You now need both packages:</p>
<ul>
<li><code>@docfy/ember-cli</code> for build-time markdown processing</li>
<li><code>@docfy/ember</code> for runtime components</li>
</ul>
<h5 id="2-configuration"><a href="#2-configuration">2. Configuration</a></h5>
<p>Your existing <code>.docfy-config.js</code> continues to work without changes.</p>
<h4 id="to-docfyember-vite-recommended-for-new-projects"><a href="#to-docfyember-vite-recommended-for-new-projects">To @docfy/ember-vite (Recommended for New Projects)</a></h4>
<p>If you want to migrate to the modern Vite build system:</p>
<h5 id="1-vite-app"><a href="#1-vite-app">1. Vite App</a></h5>
<p>Make sure your Ember app is set up with <code>@embroider/vite</code>.</p>
<h5 id="2-install-dependencies"><a href="#2-install-dependencies">2. Install Dependencies</a></h5>
<pre><code class="hljs language-bash"><span class="hljs-comment"># Install Docfy packages</span>
npm install --save-dev @docfy/ember-vite</code></pre>
<h5 id="3-configure-vite"><a href="#3-configure-vite">3. Configure Vite</a></h5>
<p>Create or update <code>vite.config.mjs</code>:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> { defineConfig } <span class="hljs-keyword">from</span> <span class="hljs-string">'vite'</span>;
<span class="hljs-keyword">import</span> { babel } <span class="hljs-keyword">from</span> <span class="hljs-string">'@rollup/plugin-babel'</span>;
<span class="hljs-keyword">import</span> { docfyVite } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-vite'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> defineConfig({
  <span class="hljs-attr">plugins</span>: [
    docfyVite({
      <span class="hljs-attr">sources</span>: [
        {
          <span class="hljs-attr">root</span>: path.resolve(__dirname, <span class="hljs-string">'docs'</span>),
          <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
          <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
        },
      ],
    }),
    <span class="hljs-comment">// ... Embroider Vite plugins</span>
  ],
});</code></pre>
<h3 id="breaking-changes-in-v010x"><a href="#breaking-changes-in-v010x">Breaking Changes in v0.10.x</a></h3>
<h4 id="component-location"><a href="#component-location">Component Location</a></h4>
<p>Components are now provided by the <code>@docfy/ember</code> runtime package as a v2 addon:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// All packages now use the same runtime components</span>
<span class="hljs-keyword">import</span> { DocfyOutput, DocfyLink } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember'</span>;</code></pre>
<h3 id="new-features-in-v010x"><a href="#new-features-in-v010x">New Features in v0.10.x</a></h3>
<h4 id="better-typescript-support"><a href="#better-typescript-support">Better TypeScript Support</a></h4>
<p>All packages now include comprehensive TypeScript definitions:</p>
<pre><code class="hljs language-ts"><span class="hljs-keyword">import</span> <span class="hljs-keyword">type</span> { DocfyViteOptions } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-vite'</span>;
<span class="hljs-keyword">import</span> <span class="hljs-keyword">type</span> { PageMetadata, NestedPageMetadata } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/core'</span>;</code></pre>
<h3 id="troubleshooting-v010x-upgrade"><a href="#troubleshooting-v010x-upgrade">Troubleshooting v0.10.x Upgrade</a></h3>
<h4 id="build-errors"><a href="#build-errors">Build Errors</a></h4>
<p>If you encounter build errors after migration:</p>
<ol>
<li><strong>Clear cache</strong>: Delete <code>node_modules</code>, <code>dist</code>, and <code>tmp</code> directories, then reinstall</li>
<li><strong>Check imports</strong>: Ensure you're importing from the correct packages</li>
<li><strong>Verify configuration</strong>: Make sure your configuration matches the new format</li>
</ol>
<h4 id="runtime-errors"><a href="#runtime-errors">Runtime Errors</a></h4>
<p>If components aren't rendering:</p>
<ol>
<li><strong>Check service</strong>: Ensure the Docfy service is properly injected</li>
<li><strong>Verify data</strong>: Check that markdown files are being processed correctly</li>
<li><strong>Template syntax</strong>: Ensure you're using the correct component APIs</li>
</ol>
<h4 id="performance-issues"><a href="#performance-issues">Performance Issues</a></h4>
<p>If builds are slow:</p>
<ol>
<li><strong>Use Vite</strong>: Consider migrating to <code>@docfy/ember-vite</code> for faster builds</li>
<li><strong>Optimize sources</strong>: Limit the scope of your markdown file patterns</li>
<li><strong>Cache configuration</strong>: Ensure proper caching is enabled</li>
</ol>
<h3 id="benefits-of-migration"><a href="#benefits-of-migration">Benefits of Migration</a></h3>
<p>The new architecture provides:</p>
<ul>
<li><strong>Better separation of concerns</strong> - Runtime vs build-time packages</li>
<li><strong>Faster development builds</strong> - With Vite integration</li>
<li><strong>Improved TypeScript support</strong> - Better type definitions</li>
<li><strong>More flexible deployment</strong> - Choose your build system</li>
<li><strong>Future-proof architecture</strong> - Ready for Ember's modern build pipeline</li>
</ul>
<h2 id="getting-help"><a href="#getting-help">Getting Help</a></h2>
<p>If you encounter issues during migration:</p>
<ol>
<li>Check the <a href="https://github.com/josemarluedke/docfy/issues">GitHub Issues</a></li>
<li>Review the updated documentation for each package</li>
<li>Create a new issue with your specific migration scenario</li>
</ol>
</template>