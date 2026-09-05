import { DocfyLink } from '@docfy/ember';
import { DocfyCodeBlock } from '@docfy/ember';

<template>
  <h1 id="configuration"><a href="#configuration">Configuration</a></h1>
<p>Docfy has a few options you can change to enhance and, or modify Docfy behavior. There are two categories of options, first, base configuration, and second, the source of files configuration.</p>
<h2 id="base-configuration"><a href="#base-configuration">Base configuration</a></h2>
<p>Here you can customize the base options, such as the Docfy plugins, remark
plugins, rehype plugins, the git repository URL, and more.
Below you can see an example of how to pass these options to Docfy.</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> Docfy </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@docfy/core'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> docfy</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Docfy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">({</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  plugins: [],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  remarkPlugins: [],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  rehypePlugins: [],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  staticAssetsPath: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'/assets/docfy'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  tocMaxDepth: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">6</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  repository: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    url: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'https://github.com/josemarluedke/docfy'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  sections: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    docs: { label: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Documentation'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, order: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    api: { label: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'API Reference'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, order: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">});</span></span></code></pre></DocfyCodeBlock>
<h3 id="plugins"><a href="#plugins"><code>plugins</code></a></h3>
<p>• <strong>plugins</strong>? : <em>Plugin[]</em> - A list of Docfy plugins.</p>
<h3 id="remarkplugins"><a href="#remarkplugins"><code>remarkPlugins</code></a></h3>
<p>• <strong>remarkPlugins</strong>? : <em>function | [function, RemarkPluginOptions][]</em> - Additional remark plugins</p>
<p>Example:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> hbs </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'remark-hbs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> codeImport </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'remark-code-import'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> remarkPlugins</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> [codeImport, hbs];</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">//...</span></span></code></pre></DocfyCodeBlock>
<p>In case the plugin has options, you can specify as the example below:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// ..</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> remarkPlugins</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    codeImport,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      preserveTrailingNewline: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">true</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">];</span></span></code></pre></DocfyCodeBlock>
<h3 id="rehypeplugins"><a href="#rehypeplugins"><code>rehypePlugins</code></a></h3>
<p>• <strong>rehypePlugins</strong>? : <em>function | [function, RehypePluginOptions][]</em> - Additional rehype plugins</p>
<p>You can also pass options to rehype plugins the same way as remark plugins.</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> autolinkHeadings </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'rehype-autolink-headings'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> highlight </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'rehype-highlight'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> rehypePlugins</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> [[autolinkHeadings, { behavior: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'wrap'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> }], highlight];</span></span></code></pre></DocfyCodeBlock>
<p>Most of the remark/rehype ecosystem is ESM-only. Docfy requires a Node version
that supports <code>require()</code> of ES modules, so you can load those plugins from a
CommonJS config file as well — just remember that <code>require()</code> hands you the
module namespace:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// .docfy-config.js (CommonJS)</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> highlight</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'rehype-highlight'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">).default;</span></span></code></pre></DocfyCodeBlock>
<h4 id="syntax-highlighting"><a href="#syntax-highlighting">Syntax highlighting</a></h4>
<p>Highlighting is a rehype concern. Use
<a href="https://github.com/rehypejs/rehype-highlight"><code>rehype-highlight</code></a> (highlight.js)
or <a href="https://github.com/timlrx/rehype-prism-plus"><code>rehype-prism-plus</code></a> (Prism).
The older <code>remark-highlight.js</code> and <code>@mapbox/rehype-prism</code> packages are
unmaintained and pinned to highlight.js 10 / old refractor builds; they do not
work with the current unified stack.</p>
<p>For Ember apps built with <code>@docfy/ember-vite</code>, use <code>@docfy/plugin-shiki</code>
instead: it ships real TextMate grammars for <code>.gjs</code>/<code>.gts</code>/<code>.hbs</code> (Shiki's
<code>glimmer-js</code>, <code>glimmer-ts</code>, and <code>handlebars</code> grammars), so those fences
tokenize correctly instead of falling back to plain JavaScript highlighting:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> autolinkHeadings </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'rehype-autolink-headings'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> shiki </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@docfy/plugin-shiki'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> rehypePlugins</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> [[autolinkHeadings, { behavior: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'wrap'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> }], </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">...</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">shiki</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">()];</span></span></code></pre></DocfyCodeBlock>
<p><code>@docfy/plugin-shiki</code> also powers <code>@docfy/ember</code>'s <code>DocfyCodeBlock</code> line
numbers and highlighted line ranges. See
<DocfyLink @to="/docs/ember/code-blocks"  >Code Blocks</DocfyLink> for the full setup and every fence
feature it unlocks.</p>
<p>If you're not on <code>@docfy/ember-vite</code>, <code>rehype-highlight</code> with
<a href="https://github.com/NullVoxPopuli/highlightjs-glimmer"><code>highlightjs-glimmer</code></a>
still gives proper <code>gjs</code>/<code>gts</code>/<code>hbs</code> highlighting:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> highlight </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'rehype-highlight'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { glimmer } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'highlightjs-glimmer'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { common } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'lowlight'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> rehypePlugins</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  [</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    highlight,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      languages: { </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">common, glimmer, hbs: glimmer, handlebars: glimmer },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      aliases: { javascript: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'gjs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">], typescript: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'gts'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">] },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">];</span></span></code></pre></DocfyCodeBlock>
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
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> config</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  sections: {</span></span>
<span class="line"><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">    'getting-started'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: { label: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Getting Started'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, order: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    api: { label: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'API Reference'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, order: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    guides: { label: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Guides'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, order: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    examples: { label: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Examples'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> }, </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// No order, will be alphabetically sorted</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
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
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> config</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  repository: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    url: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'https://github.com/josemarluedke/docfy'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    editBranch: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'main'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
<h4 id="repositoryconfig"><a href="#repositoryconfig"><code>RepositoryConfig</code></a></h4>
<ul>
<li><strong>url</strong>: <em>string</em> - The URL to the Git Repository, for example: <code>https://github.com/josemarluedke/docfy</code></li>
<li><strong>editBranch</strong>? : <em>string</em> - Branch used to edit your markdown when clicking
on an "Edit this page" link. <strong>defaults to <code>"master"</code></strong></li>
</ul>
<h2 id="source-configuration"><a href="#source-configuration">Source Configuration</a></h2>
<p>Here you specify where your markdown content should come from. Additionally, you can setup options for the URLs and overwrite the base repository config.
Below you can see an example of how to pass these options to Docfy.</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">docfy</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">run</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">([</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      root: __dirname,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      pattern: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'**/*.md'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      ignore: [</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'private/**'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">],</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      urlPrefix: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      urlSchema: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'manual'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ])</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">then</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">result</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =></span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(result);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  });</span></span></code></pre></DocfyCodeBlock>
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
<DocfyCodeBlock ><pre><code>- install.md
- components/
  - button.md
  - card.md
</code></pre></DocfyCodeBlock>
<p>The URLs would look like this, (assuming <code>urlPrefix</code> is set to <code>docs</code>).</p>
<DocfyCodeBlock ><pre><code>- docs/install
- docs/components/buttons
- docs/components/card
</code></pre></DocfyCodeBlock>
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