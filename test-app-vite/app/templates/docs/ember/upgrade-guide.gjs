<template>
  <h1 id="upgrade-guide"><a href="#upgrade-guide">Upgrade Guide</a></h1>
<p>This guide helps you upgrade between different versions of Docfy's Ember integration packages.</p>
<h2 id="upgrading-to-v013x"><a href="#upgrading-to-v013x">Upgrading to v0.13.x</a></h2>
<p>Version 0.13.0 moves Docfy onto the current unified/remark stack (unified 11,
remark 11, rehype 11). Docfy's own packages are now ES modules.</p>
<h3 id="node-version"><a href="#node-version">Node version</a></h3>
<p>Docfy now requires Node <code>^20.19.0 || >=22.12.0</code>. This is not negotiable: those
are the versions where <code>require()</code> of an ES module works, which is what allows
the classic Ember CLI build and CommonJS config files to keep working against
ESM-only packages.</p>
<h3 id="your-config-file-keeps-working"><a href="#your-config-file-keeps-working">Your config file keeps working</a></h3>
<p>There is no forced migration to <code>.mjs</code>. A CommonJS <code>.docfy-config.js</code> is still
fully supported, including <code>require()</code>-ing ESM-only remark/rehype plugins.
<code>@docfy/ember-cli</code> now also accepts <code>.docfy-config.mjs</code> and <code>.docfy-config.cjs</code>.</p>
<p>The one thing a classic-build config cannot do is use top-level <code>await</code> — Ember
CLI's build is synchronous. Docfy raises an explicit error if it finds one.
<code>@docfy/ember-vite</code> has no such restriction.</p>
<h3 id="syntax-highlighting-must-move-to-rehype"><a href="#syntax-highlighting-must-move-to-rehype">Syntax highlighting must move to rehype</a></h3>
<p>This is the change most projects will actually have to make. <code>remark-highlight.js</code>
and <code>@mapbox/rehype-prism</code> are unmaintained and pinned to highlight.js 10 / old
refractor builds, and they do not work with unified 11.</p>
<pre><code class="hljs language-diff"><span class="hljs-deletion">-import highlight from 'remark-highlight.js';</span>
<span class="hljs-addition">+import highlight from 'rehype-highlight';</span>

<span class="hljs-deletion">-  remarkPlugins: [highlight],</span>
<span class="hljs-addition">+  rehypePlugins: [highlight],</span>
</code></pre>
<p>Use <a href="https://github.com/rehypejs/rehype-highlight"><code>rehype-highlight</code></a> for
highlight.js or <a href="https://github.com/timlrx/rehype-prism-plus"><code>rehype-prism-plus</code></a>
for Prism. Because highlight.js 11 now works, so does
<a href="https://github.com/NullVoxPopuli/highlightjs-glimmer"><code>highlightjs-glimmer</code></a>:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> highlight <span class="hljs-keyword">from</span> <span class="hljs-string">'rehype-highlight'</span>;
<span class="hljs-keyword">import</span> { glimmer } <span class="hljs-keyword">from</span> <span class="hljs-string">'highlightjs-glimmer'</span>;
<span class="hljs-keyword">import</span> { common } <span class="hljs-keyword">from</span> <span class="hljs-string">'lowlight'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  <span class="hljs-attr">rehypePlugins</span>: [
    [
      highlight,
      {
        <span class="hljs-attr">languages</span>: { ...common, glimmer, <span class="hljs-attr">hbs</span>: glimmer, <span class="hljs-attr">handlebars</span>: glimmer },
        <span class="hljs-attr">aliases</span>: { <span class="hljs-attr">javascript</span>: [<span class="hljs-string">'gjs'</span>], <span class="hljs-attr">typescript</span>: [<span class="hljs-string">'gts'</span>] },
      },
    ],
  ],
};
</code></pre>
<blockquote>
<p><strong><code>languages</code> replaces the defaults, it does not extend them.</strong>
<code>rehype-highlight</code> uses <code>options.languages || common</code>, so passing your own map
silently turns off highlighting for every other language. Spread lowlight's
<code>common</code> back in (add <code>lowlight</code> as a dependency to import it).</p>
</blockquote>
<p><strong>If your app depends on <code>highlight.js</code> directly, leave that dependency where it
is.</strong> <code>rehype-highlight</code> brings its own copy via <code>lowlight</code>. Bumping a direct
<code>highlight.js</code> 10 dependency to 11 at the same time is an unrelated migration
and will break any code of yours that registers languages by hand.</p>
<h3 id="curly-escaping-moved-after-highlighting"><a href="#curly-escaping-moved-after-highlighting">Curly escaping moved after highlighting</a></h3>
<p>Docfy escapes <code>\{{</code> inside code blocks so Ember's template compiler does not read
them as mustaches. That used to happen while the document was still markdown,
which broke as soon as a rehype highlighter started injecting <code>&#x3C;span></code>s into code
blocks afterwards. Docfy now escapes at the HTML stage, after all rehype plugins
have run.</p>
<p>As a result, Docfy manages <code>remarkHbsOptions.escapeCurliesCode</code> and
<code>escapeCurliesInlineCode</code> itself. <strong>Remove those options from your config</strong> if you
set them; setting <code>escapeCurliesCode: false</code> alongside a highlighter is what
produces errors like:</p>
<pre><code>Parse error on line 23:
...tuation mustache">\{{&#x3C;span class="hljs-cl
-----------------------^
</code></pre>
<h3 id="other-deprecated-plugins"><a href="#other-deprecated-plugins">Other deprecated plugins</a></h3>
<pre><code class="hljs language-diff"><span class="hljs-deletion">-import autolinkHeadings from 'remark-autolink-headings';</span>
<span class="hljs-addition">+import autolinkHeadings from 'rehype-autolink-headings';</span>

<span class="hljs-deletion">-  remarkPlugins: [autolinkHeadings],</span>
<span class="hljs-addition">+  rehypePlugins: [[autolinkHeadings, { behavior: 'wrap' }]],</span>
</code></pre>
<p><code>remark-slug</code> and <code>remark-autolink-headings</code> are both deprecated. Docfy no longer
depends on <code>remark-slug</code> at all — heading ids are generated internally and are
unchanged, so your anchor links keep working.</p>
<p>Also worth bumping if you use them: <code>remark-code-import</code> to <code>^1.0.0</code>,
<code>remark-math</code> to <code>^6.0.0</code>, <code>rehype-katex</code> to <code>^7.0.0</code>. Note that <code>remark-math</code> 6
renders un-<code>katex</code>'d math as <code>&#x3C;code class="language-math"></code> rather than
<code>&#x3C;span class="math"></code>.</p>
<h4 id="remark-code-import-needs-a-rootdir"><a href="#remark-code-import-needs-a-rootdir">remark-code-import needs a <code>rootDir</code></a></h4>
<p><code>remark-code-import</code> v1 refuses to read files outside <code>rootDir</code>, which defaults
to the process working directory. In a monorepo — or any setup where the docs
live outside the app being built — you have to say where the root is:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> path <span class="hljs-keyword">from</span> <span class="hljs-string">'path'</span>;
<span class="hljs-keyword">import</span> codeImport <span class="hljs-keyword">from</span> <span class="hljs-string">'remark-code-import'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> {
  <span class="hljs-attr">remarkPlugins</span>: [[codeImport, { <span class="hljs-attr">rootDir</span>: path.<span class="hljs-title function_">join</span>(<span class="hljs-keyword">import</span>.<span class="hljs-property">meta</span>.<span class="hljs-property">dirname</span>, <span class="hljs-string">'..'</span>) }]],
};
</code></pre>
<p>Without it you get <code>Attempted to import code from "…", which is outside from the rootDir "…"</code>.</p>
<h3 id="if-you-use-docfycore-directly"><a href="#if-you-use-docfycore-directly">If you use @docfy/core directly</a></h3>
<p>Plain <code>require('@docfy/core')</code> now returns a module namespace rather than the
class:</p>
<pre><code class="hljs language-diff"><span class="hljs-deletion">-const Docfy = require('@docfy/core');</span>
<span class="hljs-addition">+const Docfy = require('@docfy/core').default;</span>
</code></pre>
<p>TypeScript consumers using <code>import Docfy from '@docfy/core'</code> with
<code>esModuleInterop</code>, and anything already using ESM <code>import</code>, need no change.</p>
<p>Deep imports from ESM need a file extension:</p>
<pre><code class="hljs language-diff"><span class="hljs-deletion">-import plugin from '@docfy/core/lib/plugin';</span>
<span class="hljs-addition">+import plugin from '@docfy/core/lib/plugin.js';</span>
</code></pre>
<p>Type-only imports such as <code>@docfy/core/lib/types</code> are erased at compile time and
work either way.</p>
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
npm install --save-dev @docfy/ember-cli
</code></pre>
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
npm install --save-dev @docfy/ember-vite
</code></pre>
<h5 id="3-configure-vite"><a href="#3-configure-vite">3. Configure Vite</a></h5>
<p>Create or update <code>vite.config.mjs</code>:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> { defineConfig } <span class="hljs-keyword">from</span> <span class="hljs-string">'vite'</span>;
<span class="hljs-keyword">import</span> { babel } <span class="hljs-keyword">from</span> <span class="hljs-string">'@rollup/plugin-babel'</span>;
<span class="hljs-keyword">import</span> { docfyVite } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-vite'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title function_">defineConfig</span>({
  <span class="hljs-attr">plugins</span>: [
    <span class="hljs-title function_">docfyVite</span>({
      <span class="hljs-attr">sources</span>: [
        {
          <span class="hljs-attr">root</span>: path.<span class="hljs-title function_">resolve</span>(__dirname, <span class="hljs-string">'docs'</span>),
          <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
          <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
        },
      ],
    }),
    <span class="hljs-comment">// ... Embroider Vite plugins</span>
  ],
});
</code></pre>
<h3 id="breaking-changes-in-v010x"><a href="#breaking-changes-in-v010x">Breaking Changes in v0.10.x</a></h3>
<h4 id="component-location"><a href="#component-location">Component Location</a></h4>
<p>Components are now provided by the <code>@docfy/ember</code> runtime package as a v2 addon:</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// All packages now use the same runtime components</span>
<span class="hljs-keyword">import</span> { <span class="hljs-title class_">DocfyOutput</span>, <span class="hljs-title class_">DocfyLink</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember'</span>;
</code></pre>
<h3 id="new-features-in-v010x"><a href="#new-features-in-v010x">New Features in v0.10.x</a></h3>
<h4 id="better-typescript-support"><a href="#better-typescript-support">Better TypeScript Support</a></h4>
<p>All packages now include comprehensive TypeScript definitions:</p>
<pre><code class="hljs language-ts"><span class="hljs-keyword">import</span> <span class="hljs-keyword">type</span> { <span class="hljs-title class_">DocfyViteOptions</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-vite'</span>;
<span class="hljs-keyword">import</span> <span class="hljs-keyword">type</span> { <span class="hljs-title class_">PageMetadata</span>, <span class="hljs-title class_">NestedPageMetadata</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/core'</span>;
</code></pre>
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