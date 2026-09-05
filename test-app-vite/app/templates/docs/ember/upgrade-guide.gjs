import { DocfyCodeBlock } from '@docfy/ember';

<template>
  <h1 id="upgrade-guide"><a href="#upgrade-guide">Upgrade Guide</a></h1>
<p>This guide helps you upgrade between different versions of Docfy's Ember integration packages.</p>
<h2 id="upgrading-to-v013x"><a href="#upgrading-to-v013x">Upgrading to v0.13.x</a></h2>
<p>Version 0.13.0 moves Docfy onto the current unified/remark stack (unified 11,
remark 11, rehype 11). Docfy's own packages are now ES modules.</p>
<h3 id="node-version"><a href="#node-version">Node version</a></h3>
<p>Docfy now requires Node <code>>=22.22.2</code>. Note what that drops: Node 20 entirely, and
also Node 22.12 through 22.22. If you are on Node 20 or on an early 22.x, you need
to upgrade Node first.</p>
<p>Two different constraints combine to produce that floor. Docfy needs <code>require()</code> of
an ES module to work, which is what allows the classic Ember CLI build and CommonJS
config files to keep working against ESM-only packages; that support landed in Node
20.19 and 22.12, so on its own it would only require those. The floor is higher
because <code>hosted-git-info</code>, the dependency that builds "edit this page" links,
requires 22.22.2 as its own minimum.</p>
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
<DocfyCodeBlock @language="diff"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="diff"><code><span class="line"><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7">-import highlight from 'remark-highlight.js';</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">+import highlight from 'rehype-highlight';</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7">-  remarkPlugins: [highlight],</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">+  rehypePlugins: [highlight],</span></span></code></pre></DocfyCodeBlock>
<p>Use <a href="https://github.com/rehypejs/rehype-highlight"><code>rehype-highlight</code></a> for
highlight.js or <a href="https://github.com/timlrx/rehype-prism-plus"><code>rehype-prism-plus</code></a>
for Prism. Because highlight.js 11 now works, so does
<a href="https://github.com/NullVoxPopuli/highlightjs-glimmer"><code>highlightjs-glimmer</code></a>:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> highlight </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'rehype-highlight'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { glimmer } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'highlightjs-glimmer'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { common } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'lowlight'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  rehypePlugins: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      highlight,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        languages: { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">common, glimmer, hbs: glimmer, handlebars: glimmer },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        aliases: { javascript: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'gjs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">], typescript: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'gts'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">] },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
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
<DocfyCodeBlock ><pre><code>Parse error on line 23:
...tuation mustache">\{{&#x3C;span class="hljs-cl
-----------------------^
</code></pre></DocfyCodeBlock>
<h3 id="other-deprecated-plugins"><a href="#other-deprecated-plugins">Other deprecated plugins</a></h3>
<DocfyCodeBlock @language="diff"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="diff"><code><span class="line"><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7">-import autolinkHeadings from 'remark-autolink-headings';</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">+import autolinkHeadings from 'rehype-autolink-headings';</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7">-  remarkPlugins: [autolinkHeadings],</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">+  rehypePlugins: [[autolinkHeadings, { behavior: 'wrap' }]],</span></span></code></pre></DocfyCodeBlock>
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
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> path </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'path'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> codeImport </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'remark-code-import'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  remarkPlugins: [[codeImport, { rootDir: path.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">join</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">meta</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.dirname, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'..'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">) }]],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
<p>Without it you get <code>Attempted to import code from "…", which is outside from the rootDir "…"</code>.</p>
<h3 id="if-you-use-docfycore-directly"><a href="#if-you-use-docfycore-directly">If you use @docfy/core directly</a></h3>
<p>Plain <code>require('@docfy/core')</code> now returns a module namespace rather than the
class:</p>
<DocfyCodeBlock @language="diff"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="diff"><code><span class="line"><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7">-const Docfy = require('@docfy/core');</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">+const Docfy = require('@docfy/core').default;</span></span></code></pre></DocfyCodeBlock>
<p>TypeScript consumers using <code>import Docfy from '@docfy/core'</code> with
<code>esModuleInterop</code>, and anything already using ESM <code>import</code>, need no change.</p>
<p>Deep imports from ESM need a file extension:</p>
<DocfyCodeBlock @language="diff"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="diff"><code><span class="line"><span style="--shiki-light:#B31D28;--shiki-dark:#FDAEB7">-import plugin from '@docfy/core/lib/plugin';</span></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">+import plugin from '@docfy/core/lib/plugin.js';</span></span></code></pre></DocfyCodeBlock>
<p>Type-only imports such as <code>@docfy/core/lib/types</code> are erased at compile time and
work either way.</p>
<h2 id="upgrading-to-v010x"><a href="#upgrading-to-v010x">Upgrading to v0.10.x</a></h2>
<p>Version 0.10.0 introduced a major architectural change with the new package structure. This section helps you migrate from previous versions to the new modular architecture.</p>
<h3 id="package-structure-changes"><a href="#package-structure-changes">Package Structure Changes</a></h3>
<h4 id="previous-architecture"><a href="#previous-architecture">Previous Architecture</a></h4>
<DocfyCodeBlock ><pre><code>@docfy/ember - Single package with build integration + components
</code></pre></DocfyCodeBlock>
<h4 id="new-architecture"><a href="#new-architecture">New Architecture</a></h4>
<DocfyCodeBlock ><pre><code>@docfy/ember - Runtime components only (v2 addon)
@docfy/ember-cli - Classic build integration + components
@docfy/ember-vite - Modern Vite integration + components
</code></pre></DocfyCodeBlock>
<h3 id="migration-paths"><a href="#migration-paths">Migration Paths</a></h3>
<h4 id="from-docfyember-classic"><a href="#from-docfyember-classic">From @docfy/ember (Classic)</a></h4>
<p>If you were using <code>@docfy/ember</code> with classic Ember CLI builds:</p>
<h5 id="1-update-package-dependencies"><a href="#1-update-package-dependencies">1. Update Package Dependencies</a></h5>
<DocfyCodeBlock @language="bash"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="bash"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D"># Install new packages</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> --save-dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @docfy/ember-cli</span></span></code></pre></DocfyCodeBlock>
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
<DocfyCodeBlock @language="bash"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="bash"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D"># Install Docfy packages</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> --save-dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @docfy/ember-vite</span></span></code></pre></DocfyCodeBlock>
<h5 id="3-configure-vite"><a href="#3-configure-vite">3. Configure Vite</a></h5>
<p>Create or update <code>vite.config.mjs</code>:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { defineConfig } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'vite'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { babel } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@rollup/plugin-babel'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { docfyVite } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@docfy/ember-vite'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> defineConfig</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  plugins: [</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">    docfyVite</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      sources: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">          root: path.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">resolve</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(__dirname, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">          pattern: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'**/*.md'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">          urlPrefix: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    }),</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // ... Embroider Vite plugins</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">});</span></span></code></pre></DocfyCodeBlock>
<h3 id="breaking-changes-in-v010x"><a href="#breaking-changes-in-v010x">Breaking Changes in v0.10.x</a></h3>
<h4 id="component-location"><a href="#component-location">Component Location</a></h4>
<p>Components are now provided by the <code>@docfy/ember</code> runtime package as a v2 addon:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// All packages now use the same runtime components</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { DocfyOutput, DocfyLink } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@docfy/ember'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span></code></pre></DocfyCodeBlock>
<h3 id="new-features-in-v010x"><a href="#new-features-in-v010x">New Features in v0.10.x</a></h3>
<h4 id="better-typescript-support"><a href="#better-typescript-support">Better TypeScript Support</a></h4>
<p>All packages now include comprehensive TypeScript definitions:</p>
<DocfyCodeBlock @language="ts"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="ts"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { DocfyViteOptions } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@docfy/ember-vite'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { PageMetadata, NestedPageMetadata } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@docfy/core'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span></code></pre></DocfyCodeBlock>
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