import { DocfyLink } from '@docfy/ember';
import { DocfyCodeBlock } from '@docfy/ember';

<template>
  <h1 id="docfydemo"><a href="#docfydemo">{{"<DocfyDemo>"}}</a></h1>
<p>This component is used internally to render demos. It's not meant to be used directly,
although that's possible. The scope of what you want to understand is the CSS
classes such that you can style the parts of the demo component yourself.</p>
<p>Make sure to look at <DocfyLink @to="/docs/ember/writing-demos"  >writing demos</DocfyLink>, so you can understand how demos look.</p>
<p>Below is an example of how styling could look like. It uses
<a href="https://tailwindcss.com/">TailwindCSS</a> and <a href="https://github.com/postcss/postcss-nested">PostCSS Nested</a>.</p>
<DocfyCodeBlock @language="css"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="css"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">.docfy-demo__example</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> p-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">4 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">border</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> rounded-t</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">.docfy-demo__description</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> p-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">4 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">border-l</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> border-r</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x26;__</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">header</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> flex</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> justify-between</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x26;__</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">title</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> mb-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">4 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">font-medium</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> leading-tight</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> text-gray-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">900;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x26;__edit-url {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> text-sm</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x26;__content {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> markdown</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">.docfy-demo__snippets</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x26;__</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">tabs</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> px-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">2 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">border-l</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> border-r</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x26;__</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">button</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> p-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">2 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">mr-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">2 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">border-b-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">4;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x26;</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">--active</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x26;:hover {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        @apply border-blue-500;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">.docfy-demo__snippet</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">  pre</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> p-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">4;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> flex</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> text-gray-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">200 </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">bg-gray-</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">800;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> text-sm</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> leading-normal</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> font-mono</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    @</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">apply</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> rounded-b</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    scrollbar-width</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">: </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">none</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span></code></pre></DocfyCodeBlock>
</template>