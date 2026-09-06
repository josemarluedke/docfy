import { DocfyLink } from '@docfy/ember';
import { DocfyCodeBlock } from '@docfy/ember';

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
<DocfyCodeBlock @language="bash"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="bash"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> --save-dev</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @docfy/ember-cli</span></span></code></pre></DocfyCodeBlock>
<h2 id="configuration-file"><a href="#configuration-file">Configuration File</a></h2>
<p>Create <code>.docfy-config.js</code> in your project root (note the dot prefix):</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> path</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'path'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  sources: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      root: path.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">join</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(__dirname, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      pattern: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'**/*.md'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      urlPrefix: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
<p><code>.docfy-config.js</code>, <code>.docfy-config.mjs</code> and <code>.docfy-config.cjs</code> are all
supported, and the file is loaded synchronously either way — Node's support for
<code>require()</code> of ES modules means the classic build no longer has to care which
module format you picked.</p>
<p>The same applies to the plugins you load from it. Most of the remark/rehype
ecosystem is ESM-only these days, and a CommonJS config can <code>require()</code> those
plugins directly; <code>require()</code> returns the module namespace, so reach for
<code>.default</code>:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// .docfy-config.js</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> path</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'path'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> highlight</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'rehype-highlight'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">).default;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> autolinkHeadings</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'rehype-autolink-headings'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">).default;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  rehypePlugins: [[autolinkHeadings, { behavior: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'wrap'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> }], highlight],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  sources: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      root: path.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">join</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(__dirname, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      pattern: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'**/*.md'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      urlPrefix: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
<p>Or the same thing as ESM, where imports need no unwrapping:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// .docfy-config.mjs</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> path </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'path'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> highlight </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'rehype-highlight'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> autolinkHeadings </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'rehype-autolink-headings'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  rehypePlugins: [[autolinkHeadings, { behavior: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'wrap'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> }], highlight],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  sources: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      root: path.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">join</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">meta</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.dirname, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      pattern: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'**/*.md'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      urlPrefix: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
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
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// .docfy-config.js</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> highlight</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'rehype-highlight'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">).default;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">glimmer</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'highlightjs-glimmer'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">common</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'lowlight'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  rehypePlugins: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      highlight,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">        // `languages` replaces rehype-highlight's defaults rather than</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">        // extending them, so spread lowlight's `common` back in.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        languages: { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">common, glimmer, hbs: glimmer, handlebars: glimmer },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        aliases: { javascript: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'gjs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">], typescript: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'gts'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">] },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">  // ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
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
<DocfyCodeBlock @language="md"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="md"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold"># Quick Button Demo</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```hbs preview-template</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">Button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">variant=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'primary'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">onClick=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">this.handleClick</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  Click me!</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">Button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```</span></span></code></pre></DocfyCodeBlock>
<p>This creates a demo component with an empty Glimmer component class, perfect for simple examples.</p>
<h3 id="static-site-generation-with-prember"><a href="#static-site-generation-with-prember">Static Site Generation with Prember</a></h3>
<p>Generate fully static documentation sites that work without JavaScript:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// ember-cli-build.js</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">Webpack</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'@embroider/webpack'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">defaults</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> app</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> EmberApp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(defaults, {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // ... your app config</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">  // Add prember for static site generation</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  return</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'prember'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">prerender</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(app, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    urls: [</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">      '/docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">      '/docs/installation'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">      '/docs/components/button'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">      // Add all your documentation URLs</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
<p>This generates static HTML files that can be deployed to any CDN or static hosting service.</p>
<h2 id="advanced-configuration"><a href="#advanced-configuration">Advanced Configuration</a></h2>
<h3 id="ember-cli-build-integration"><a href="#ember-cli-build-integration">Ember CLI Build Integration</a></h3>
<p>The addon automatically integrates with your Ember CLI build process. No additional configuration needed for basic usage.</p>
<h3 id="custom-processing"><a href="#custom-processing">Custom Processing</a></h3>
<p>Add custom Docfy plugins for specialized processing:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// .docfy-config.js</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  plugins: [</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // Custom processing plugins</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">    require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'./lib/my-custom-plugin'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  sources: [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      root: path.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">join</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(__dirname, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      pattern: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'**/*.md'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      urlPrefix: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
<h3 id="monorepo-support"><a href="#monorepo-support">Monorepo Support</a></h3>
<p>Perfect for monorepos where you want to collect docs from multiple packages:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// .docfy-config.js</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  sources: [</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // Main documentation</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      root: path.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">join</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(__dirname, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      pattern: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'**/*.md'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      urlPrefix: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // Package-specific docs</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      root: path.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">join</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(__dirname, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'packages'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      pattern: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'**/docs/**/*.md'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      urlPrefix: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'packages'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      urlSchema: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'manual'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
<h3 id="build-performance"><a href="#build-performance">Build Performance</a></h3>
<p>For large documentation sites, you can optimize build performance:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// ember-cli-build.js</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> function</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">defaults</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> app</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> EmberApp</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(defaults, {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">    // Disable source maps in development for faster builds</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    sourcemaps: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      enabled: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">false</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> app;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
<p>All configuration options from <DocfyLink @to="/docs/configuration"  >@docfy/core</DocfyLink> are supported.</p>
</template>