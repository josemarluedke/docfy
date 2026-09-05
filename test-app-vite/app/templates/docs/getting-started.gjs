import { DocfyCodeBlock } from '@docfy/ember';

<template>
  <h1 id="getting-started"><a href="#getting-started">Getting Started</a></h1>
<p>Here you can find a simple getting started with the Docfy Core. The core will
output an object with the processed content, metadata, and some additional data
structures for your convenience.</p>
<h2 id="create-the-project"><a href="#create-the-project">Create the project</a></h2>
<DocfyCodeBlock @language="sh"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="sh"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">mkdir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> docfy-core-getting-started</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> &#x26;&#x26; </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> docfy-core-getting-started</span></span></code></pre></DocfyCodeBlock>
<DocfyCodeBlock @language="sh"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="sh"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> init</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D"># or</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> init</span></span></code></pre></DocfyCodeBlock>
<h2 id="requirements"><a href="#requirements">Requirements</a></h2>
<p>Docfy is published as ES modules and requires Node <code>>=22.22.2</code>.</p>
<p>Two separate constraints combine to produce that floor. Docfy needs <code>require()</code> of
an ES module to work, which is what lets CommonJS tooling (Ember CLI, a CommonJS
config file) load Docfy and ESM-only remark/rehype plugins; that support landed in
Node 20.19 and 22.12. The floor is higher than those versions because
<code>hosted-git-info</code>, the dependency Docfy uses to build "edit this page" links,
requires 22.22.2 as its own minimum.</p>
<p>That dependency expresses its range as a list of LTS lines, which excludes
odd-numbered releases such as Node 23 and 25. Docfy uses a plain <code>>=</code> instead, so
developing on a current release does not produce install warnings.</p>
<h2 id="add-docfycore-as-a-dependency"><a href="#add-docfycore-as-a-dependency">Add <code>@docfy/core</code> as a dependency</a></h2>
<DocfyCodeBlock @language="sh"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="sh"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @docfy/core</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D"># or</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">yarn</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> add</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> @docfy/core</span></span></code></pre></DocfyCodeBlock>
<h2 id="initialize-docfy"><a href="#initialize-docfy">Initialize Docfy</a></h2>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// index.mjs</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> Docfy </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@docfy/core'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> path </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'path'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Docfy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">run</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">([</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      root: path.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">join</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">meta</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.dirname, </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      urlPrefix: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      pattern: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'**/*.md'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    },</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  ])</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  .</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">then</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">result</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =></span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    console.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">log</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(result);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  });</span></span></code></pre></DocfyCodeBlock>
<h2 id="create-a-markdown-file"><a href="#create-a-markdown-file">Create a markdown file</a></h2>
<DocfyCodeBlock @language="sh"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="sh"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">mkdir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> docs</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">echo</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '# Hello Docfy.'</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> ></span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> docs/README.md</span></span></code></pre></DocfyCodeBlock>
<p>If you would rather stay in CommonJS, that works too — <code>require()</code> returns the
module namespace, so reach for <code>.default</code>:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// index.cjs</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> Docfy</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'@docfy/core'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">).default;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> path</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> require</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'path'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">);</span></span></code></pre></DocfyCodeBlock>
<h2 id="run-your-script"><a href="#run-your-script">Run your script</a></h2>
<p>Now you can run the <code>index.mjs</code> we created earlier.</p>
<DocfyCodeBlock @language="sh"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="sh"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">node</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> index.mjs</span></span></code></pre></DocfyCodeBlock>
</template>