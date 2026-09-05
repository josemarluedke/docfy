import { DocfyCodeBlock } from '@docfy/ember';
import { DocfyCodeTabs } from '@docfy/ember';

<template>
  <h1 id="code-blocks"><a href="#code-blocks">Code Blocks</a></h1>
<p><code>@docfy/ember</code> ships a <code>DocfyCodeBlock</code> component that every fenced code block
in your markdown is automatically wrapped in when you use <code>@docfy/ember-vite</code>.
It adds the things a reader actually reaches for on a documentation site: a
copy button, an optional title bar, a collapse toggle for long snippets, and
(when a Shiki-based highlighter is configured) line numbers and highlighted
line ranges. A <code>:::code-tabs</code> directive groups a run of fences — most
commonly "here's the install command for every package manager" — into a
single tabbed widget.</p>
<p>None of this requires you to change how you write markdown. You still write
plain fenced code blocks; Docfy rewrites them into <code>&#x3C;DocfyCodeBlock></code>
invocations during the build. The only thing you write by hand is the fence's
<strong>meta string</strong> — the text after the language on the opening backticks — to
opt individual blocks into these features.</p>
<h2 id="setting-it-up"><a href="#setting-it-up">Setting it up</a></h2>
<p>Two things need to be true for the examples on this page to render the way
they do:</p>
<ol>
<li>
<p><code>@docfy/ember</code>'s stylesheet is imported somewhere in your app's CSS:</p>
<DocfyCodeBlock @language="css"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="css"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">@import</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@docfy/ember/code-block.css'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span></code></pre></DocfyCodeBlock>
<p>This is what defines <code>.docfy-code-block</code> and its theming custom
properties (see <a href="#theming">Theming</a> below). Without it the component still
works — the toggle still toggles, the copy button still copies — it just
has no layout or styling.</p>
</li>
<li>
<p>A Shiki-based highlighter is wired into your <code>rehypePlugins</code>, via
<code>@docfy/plugin-shiki</code>:</p>
</li>
</ol>
<DocfyCodeTabs as |tabs|>
<tabs.Tab @label="pnpm">
<DocfyCodeBlock @language="sh" @title="pnpm"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="sh"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @docfy/plugin-shiki</span></span></code></pre></DocfyCodeBlock>
</tabs.Tab>
<tabs.Tab @label="npm">
<DocfyCodeBlock @language="sh" @title="npm"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="sh"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @docfy/plugin-shiki</span></span></code></pre></DocfyCodeBlock>
</tabs.Tab>
<tabs.Tab @label="yarn">
<DocfyCodeBlock @language="sh" @title="yarn"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="sh"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @docfy/plugin-shiki</span></span></code></pre></DocfyCodeBlock>
</tabs.Tab>
<tabs.Tab @label="bun">
<DocfyCodeBlock @language="sh" @title="bun"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="sh"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">bun</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @docfy/plugin-shiki</span></span></code></pre></DocfyCodeBlock>
</tabs.Tab>
</DocfyCodeTabs>
<p>Then spread its return value into <code>rehypePlugins</code> in <code>docfy.config.mjs</code>:</p>
<DocfyCodeBlock @language="js" @title="docfy.config.mjs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> autolinkHeadings </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'rehype-autolink-headings'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> shiki </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@docfy/plugin-shiki'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  rehypePlugins: [[autolinkHeadings, { behavior: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'wrap'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> }], </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">...</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">shiki</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">()],</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">  // ...sources, sections, etc.</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">};</span></span></code></pre></DocfyCodeBlock>
<p><strong>This second step is what this page is built with.</strong> Every fence below is
tokenized by the real Shiki highlighter this preset builds — including the
<code>.gts</code>/<code>.gjs</code>/<code>.hbs</code> examples further down, which is the main reason
<code>@docfy/plugin-shiki</code> exists in the first place (see
<a href="#the-glimmer-grammars">Glimmer support</a>).</p>
<p>It's worth being precise about which feature depends on which piece, because
they're independent:</p>
<ul>
<li><strong>Title, copy, and collapse</strong> are rendered by <code>DocfyCodeBlock</code> itself. They
work with any highlighter — <code>rehype-highlight</code>, no highlighter at all, or
Shiki — because they only need the raw <code>&#x3C;pre></code> that wraps the code.</li>
<li><strong>Line numbers and highlighted line ranges</strong> are Shiki features
(<code>transformerMetaHighlight</code> walks the fence's <code>{4,9-12}</code> meta and marks
matching <code>.line</code> elements; the line-number gutter is CSS <code>counter()</code> driven
off those same <code>.line</code> elements). If you aren't using a Shiki-based
highlighter, <code>showLineNumbers</code> and a <code>{...}</code> range in a fence's meta are
silently ignored — nothing breaks, the lines just render unnumbered and
unhighlighted.</li>
</ul>
<p>If you'd rather not preload a highlighter at build time and want highlighting
to happen live in the browser instead, see
<a href="#runtime-highlighting-with-ember-shiki">Runtime highlighting with ember-shiki</a>
below.</p>
<h2 id="fence-meta-reference"><a href="#fence-meta-reference">Fence meta reference</a></h2>
<p>Everything below is written directly after the language on a fence's opening
line, space-separated, in any order:</p>
<table>
<thead>
<tr>
<th>Token</th>
<th>Example</th>
<th>Effect</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>title="..."</code></td>
<td><code>```ts title="app/foo.ts"</code></td>
<td>Renders a header bar above the code with that text.</td>
</tr>
<tr>
<td><code>{a,b-c}</code></td>
<td><code>```ts {2,4-6}</code></td>
<td>Highlights lines 2, 4, 5, and 6 (Shiki-based highlighter required).</td>
</tr>
<tr>
<td><code>showLineNumbers</code></td>
<td><code>```ts showLineNumbers</code></td>
<td>Adds a line-number gutter (Shiki-based highlighter required).</td>
</tr>
<tr>
<td><code>collapsible</code></td>
<td><code>```ts collapsible</code></td>
<td>Wraps the block in an expand/collapse toggle with a fade at the cutoff.</td>
</tr>
<tr>
<td><code>noCopy</code></td>
<td><code>```ts noCopy</code></td>
<td>Hides the copy button for this block.</td>
</tr>
</tbody>
</table>
<p>Tokens combine freely on the same fence, as several of the examples below
demonstrate.</p>
<h2 id="live-examples"><a href="#live-examples">Live examples</a></h2>
<h3 id="a-title"><a href="#a-title">A title</a></h3>
<p>A <code>title</code> is the most common thing to reach for — it turns an anonymous
snippet into "this is the file you're meant to add this to."</p>
<DocfyCodeBlock @language="ts" @title="app/utils/format-currency.ts"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="ts"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> function</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> formatCurrency</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">cents</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> number</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (cents </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> 100</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">).</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">toLocaleString</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'en-US'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    style: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'currency'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    currency: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'USD'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  });</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span></code></pre></DocfyCodeBlock>
<h3 id="highlighted-lines-and-line-numbers"><a href="#highlighted-lines-and-line-numbers">Highlighted lines and line numbers</a></h3>
<p>Line numbers make it possible to talk about "line 9" in prose next to the
block; a highlighted range draws the reader's eye to the part that actually
changed. Both come from Shiki, and both are declared entirely in the fence's
meta — no extra markup, no separate diff format.</p>
<DocfyCodeBlock @language="ts" @title="app/services/session.ts" @showLineNumbers={{true}}><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="ts"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> Service </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@ember/service'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { tracked } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@glimmer/tracking'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { action } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@ember/object'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line highlighted" data-highlighted=""><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { inject </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> service } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@ember/service'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> SessionService</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Service</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @tracked </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">currentUser</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line highlighted" data-highlighted=""><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @action</span></span>
<span class="line highlighted" data-highlighted=""><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  async</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> login</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">email</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">password</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Promise</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">> {</span></span>
<span class="line highlighted" data-highlighted=""><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> response</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> await</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> fetch</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'/api/login'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, {</span></span>
<span class="line highlighted" data-highlighted=""><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      method: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'POST'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      body: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">JSON</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">stringify</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">({ email, password }),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.currentUser </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> await</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> response.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">json</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @action</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">  logout</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">()</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.currentUser </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span></code></pre></DocfyCodeBlock>
<p>Line 4 highlights the <code>session</code> service injection that this snippet doesn't
actually use yet (a deliberate example of "here's what to add next"); lines
9-12 highlight the <code>fetch</code> call inside <code>login</code>.</p>
<h3 id="collapsible"><a href="#collapsible">Collapsible</a></h3>
<p>A <code>collapsible</code> fence starts closed at a fixed height (themeable via
<code>--docfy-code-block-collapsed-height</code>, see <a href="#theming">Theming</a>) with a fade at
the cutoff, and a toggle button to expand it. Reach for this on reference
snippets that are correct to include in full but that most readers won't want
taking up the whole page by default.</p>
<DocfyCodeBlock @language="gts" @title="app/components/data-table.gts" @collapsible={{true}}><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="glimmer-ts"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> Component </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@glimmer/component'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { tracked } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@glimmer/tracking'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { action } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@ember/object'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { fn, get } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@ember/helper'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { on } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@ember/modifier'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Column</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  key</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  label</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  sortable</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">?:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> boolean</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> DataTableSignature</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  Args</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">    columns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Column</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">[];</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">    rows</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Record</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">unknown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>[];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  };</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  Element</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> HTMLTableElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> DataTable</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Component</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">DataTableSignature</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @tracked </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">sortKey</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> string</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> |</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> null</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> null</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @tracked </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">sortDirection</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'asc'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> |</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'desc'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'asc'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  get</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> sortedRows</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">()</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Record</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">unknown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>[] {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">    const</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">sortKey</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">sortDirection</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">sortKey) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">      return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.args.rows;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">    const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> sorted</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> [</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">...</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.args.rows].</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">sort</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">((</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">b</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=></span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">      const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> left</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> a[sortKey];</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">      const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> right</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> b[sortKey];</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">      if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (left </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">===</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> right) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">return</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">      return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> left</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">!</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> &#x3C;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> right</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">!</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> ?</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> -</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">1</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> :</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> 1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">    return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> sortDirection </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">===</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'asc'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> ?</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> sorted </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> sorted.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">reverse</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @action</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">  sortBy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">column</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Column</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">)</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">!</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">column.sortable) {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">      return</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">    if</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.sortKey </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">===</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> column.key) {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">      this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.sortDirection </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.sortDirection </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">===</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'asc'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> ?</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'desc'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> :</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'asc'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">else</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">      this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.sortKey </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> column.key;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">      this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.sortDirection </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'asc'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">table</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold"> ...attributes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">thead</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">tr</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">          \{{#</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">each</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> @columns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> as</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> |column|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">            &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">th</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">              \{{#</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> column.sortable</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">                &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"button"</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> \{{on </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"click"</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> (fn</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> this.sortBy</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> column</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">)}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">                  \{{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">column.label</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">                &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">              \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">else</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">}}</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">                \{{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">column.label</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">              \{{/</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">if</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">            &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">th</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">          \{{/</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">each</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">tr</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">thead</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">tbody</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">        \{{#</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">each</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> this.sortedRows</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> as</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> |row|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">          &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">tr</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">            \{{#</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">each</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> @columns</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> as</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> |column|</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">              &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">td</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">\{{get </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">row</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> column.key</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">td</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">            \{{/</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">each</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">          &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">tr</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">        \{{/</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">each</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">tbody</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">table</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span></code></pre></DocfyCodeBlock>
<h3 id="nocopy"><a href="#nocopy">noCopy</a></h3>
<p>Not every code block is meant to be pasted into a terminal. A shell
<strong>transcript</strong> — prompts and output mixed together — reads better without a
copy button implying the whole thing is a runnable command:</p>
<DocfyCodeBlock @language="sh" @copyable={{false}}><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="sh"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">$</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> ember</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> serve</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">building...</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 3214ms</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Livereload</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> server</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> on</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> http://localhost:7020</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">Serving</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> on</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> http://localhost:4200/</span></span></code></pre></DocfyCodeBlock>
<h3 id="code-tabs"><a href="#code-tabs"><code>:::code-tabs</code></a></h3>
<p>Wrap a run of consecutive fences in a <code>:::code-tabs</code> container directive and
Docfy turns them into a single tabbed widget — one tab per fence, labeled
from that fence's <code>title=</code> or, failing that, its language. You already saw
this above in <a href="#setting-it-up">Setting it up</a> for the pnpm/npm/yarn/bun
install commands; that's the canonical use case. Written out, the source for
that block looks like this:</p>
<DocfyCodeBlock @language="md"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="md"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">:::code-tabs</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```sh title="pnpm"</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @docfy/plugin-shiki</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```sh title="npm"</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @docfy/plugin-shiki</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">:::</span></span></code></pre></DocfyCodeBlock>
<p>Every other fence feature still applies inside a tab — a tab's fence can
have its own <code>title</code>, be <code>collapsible</code>, highlight a line range, and so on.</p>
<h2 id="the-glimmer-grammars"><a href="#the-glimmer-grammars">The glimmer grammars</a></h2>
<p>The reason <code>@docfy/plugin-shiki</code> exists, ahead of every other feature on this
page, is that Shiki ships real TextMate grammars for <code>.gjs</code> and <code>.gts</code> —
<code>glimmer-js</code> and <code>glimmer-ts</code> — so a fence in either language tokenizes
<code>&#x3C;template></code> tags and <code>\{{mustaches}}</code> correctly instead of being highlighted
as (or worse, falling back to) plain JavaScript. Since <code>gts</code> is the majority
language across Ember app and addon documentation, this is the single most
load-bearing thing this preset does. <code>.hbs</code> gets the same treatment via the
<code>handlebars</code> grammar.</p>
<DocfyCodeBlock @language="gts" @title="app/components/greeting.gts"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="glimmer-ts"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> Component </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@glimmer/component'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { tracked } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@glimmer/tracking'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { action } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@ember/object'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { on } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@ember/modifier'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">interface</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> GreetingSignature</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  Args</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> string</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> };</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  Element</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> HTMLDivElement</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Greeting</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Component</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">GreetingSignature</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @tracked </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">count</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @action</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">  increment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">()</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> void</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.count</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold"> ...attributes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Hello, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">\{{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">@name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">! You clicked </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">\{{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">this.count</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> times.&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"button"</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> \{{on </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"click"</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> this.increment</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        Click me</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span></code></pre></DocfyCodeBlock>
<p>The <code>.gjs</code> grammar covers the same syntax without the TypeScript-only bits:</p>
<DocfyCodeBlock @language="gjs" @title="app/components/greeting.gjs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="glimmer-js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> Component </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@glimmer/component'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { tracked } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@glimmer/tracking'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { action } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@ember/object'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { on } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@ember/modifier'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Greeting</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Component</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @tracked </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">count</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @action</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">  increment</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">() {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    this</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.count</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">++</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-light-font-weight:bold;--shiki-dark:#E1E4E8;--shiki-dark-font-weight:bold"> ...attributes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Hello, </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">\{{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">@name</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">! You clicked </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">\{{</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">this.count</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> times.&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> type</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"button"</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> \{{on </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"click"</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> this.increment</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Click me&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">template</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span></code></pre></DocfyCodeBlock>
<p>And a plain <code>.hbs</code> template, no <code>&#x3C;template></code> tag involved, just mustaches and
block syntax:</p>
<DocfyCodeBlock @language="hbs" @title="app/templates/components/greeting.hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> ...attributes></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Hello, </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">@name</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">! You clicked </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">this.count</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> times.&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">p</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">  \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#if</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> @showButton</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">button</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> type=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"button"</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">on</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> "click"</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> this.increment</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      Click me</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">  \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
<p>A fence in a language this preset doesn't preload (anything outside the
curated set of <code>glimmer-ts</code>, <code>glimmer-js</code>, <code>handlebars</code>, <code>javascript</code>,
<code>typescript</code>, <code>jsx</code>, <code>tsx</code>, <code>json</code>, <code>css</code>, <code>scss</code>, <code>html</code>, <code>markdown</code>,
<code>shellscript</code>, <code>diff</code>, and <code>yaml</code>) degrades to plain, unhighlighted text
rather than throwing — a docs build never fails because of a stray
<code>```rust</code> fence. See the <code>@docfy/plugin-shiki</code> README for the full list and
for adding your own languages.</p>
<h2 id="theming"><a href="#theming">Theming</a></h2>
<p><code>@docfy/ember/code-block.css</code> exposes four custom properties, scoped to
<code>.docfy-code-block</code>, so you can retheme the component without overriding its
rules directly:</p>
<table>
<thead>
<tr>
<th>Custom property</th>
<th>Default</th>
<th>Controls</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>--docfy-code-block-collapsed-height</code></td>
<td><code>16rem</code></td>
<td>How tall a <code>collapsible</code> block is before it's expanded.</td>
</tr>
<tr>
<td><code>--docfy-code-block-fade</code></td>
<td><code>var(--docfy-code-block-background, #fff)</code></td>
<td>The color the fade-out gradient fades <em>to</em> — set this to your page background, or the fade will look like a visible box.</td>
</tr>
<tr>
<td><code>--docfy-code-block-highlight-background</code></td>
<td><code>rgb(101 117 133 / 20%)</code></td>
<td>Background color of a <code>{a,b-c}</code>-highlighted line.</td>
</tr>
<tr>
<td><code>--docfy-code-block-line-number-color</code></td>
<td><code>rgb(115 138 148 / 60%)</code></td>
<td>Text color of the <code>showLineNumbers</code> gutter.</td>
</tr>
</tbody>
</table>
<p>Set them wherever you already theme your app, for example alongside a dark
mode:</p>
<DocfyCodeBlock @language="css"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="css"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">:root</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  --docfy-code-block-collapsed-height</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">20</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">rem</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  --docfy-code-block-fade</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">#ffffff</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">.dark</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  --docfy-code-block-fade</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">#0d1117</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  --docfy-code-block-highlight-background</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">rgb</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">56</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> 139</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> 253</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> / </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">15</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">%</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  --docfy-code-block-line-number-color</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">rgb</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">140</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> 140</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> 140</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> / </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">60</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">%</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span></code></pre></DocfyCodeBlock>
<h2 id="limitations"><a href="#limitations">Limitations</a></h2>
<ul>
<li><strong><code>@docfy/ember-cli</code> (the classic, non-Vite build) does not get this
feature.</strong> <code>DocfyCodeBlock</code>/<code>DocfyCodeTabs</code> wrapping and <code>@docfy/plugin-shiki</code>
are both part of the <code>@docfy/ember-vite</code> pipeline described on this page.
A classic app's code fences render as plain <code>&#x3C;pre>&#x3C;code></code> the way they
always have.</li>
<li>Line numbers and highlighted ranges require a Shiki-based highlighter, as
covered in <a href="#setting-it-up">Setting it up</a>. Title, copy, and collapse do
not.</li>
</ul>
<h3 id="runtime-highlighting-with-ember-shiki"><a href="#runtime-highlighting-with-ember-shiki">Runtime highlighting with <code>ember-shiki</code></a></h3>
<p>This page (and <code>@docfy/plugin-shiki</code>) highlight at <strong>build time</strong>: the theme
is baked into the generated HTML as CSS variables, so switching light/dark
themes needs no JavaScript and no re-highlighting. If you instead want
highlighting to happen live in the browser — for example, to highlight code
that's generated or edited at runtime, which build-time highlighting can't
reach — use <a href="https://github.com/toranb/ember-shiki"><code>ember-shiki</code></a> directly
in your own components. It's unrelated to <code>@docfy/plugin-shiki</code> and to the
<code>DocfyCodeBlock</code> component described here; the two solve different problems
and aren't meant to be combined on the same block.</p>
</template>