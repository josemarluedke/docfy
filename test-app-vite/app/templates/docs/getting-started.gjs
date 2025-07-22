<template>
  <h1 id="getting-started"><a href="#getting-started">Getting Started</a></h1>
<p>Here you can find a simple getting started with the Docfy Core. The core will
output an object with the processed content, metadata, and some additional data
structures for your convenience.</p>
<h2 id="create-the-project"><a href="#create-the-project">Create the project</a></h2>
<pre><code class="hljs language-sh">mkdir docfy-core-getting-started &#x26;&#x26; <span class="hljs-built_in">cd</span> docfy-core-getting-started</code></pre>
<pre><code class="hljs language-sh">npm init
<span class="hljs-comment"># or</span>
yarn init</code></pre>
<h2 id="add-docfycore-as-a-dependency"><a href="#add-docfycore-as-a-dependency">Add <code>@docfy/core</code> as a dependency</a></h2>
<pre><code class="hljs language-sh">npm install @docfy/core
<span class="hljs-comment"># or</span>
yarn add @docfy/core</code></pre>
<h2 id="initialize-docfy"><a href="#initialize-docfy">Initialize Docfy</a></h2>
<pre><code class="hljs language-js"><span class="hljs-comment">// index.js</span>
<span class="hljs-keyword">const</span> Docfy = <span class="hljs-built_in">require</span>(<span class="hljs-string">'@docfy/core'</span>);
<span class="hljs-keyword">const</span> path = <span class="hljs-built_in">require</span>(<span class="hljs-string">'path'</span>);

<span class="hljs-keyword">new</span> Docfy()
  .run([
    {
      <span class="hljs-attr">root</span>: path.join(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
    },
  ])
  .then(<span class="hljs-function"><span class="hljs-params">result</span> =></span> {
    <span class="hljs-built_in">console</span>.log(result);
  });</code></pre>
<h2 id="create-a-markdown-file"><a href="#create-a-markdown-file">Create a markdown file</a></h2>
<pre><code class="hljs language-sh">mkdir docs
<span class="hljs-built_in">echo</span> <span class="hljs-string">'# Hello Docfy.'</span> > docs/README.md</code></pre>
<h2 id="run-your-script"><a href="#run-your-script">Run your script</a></h2>
<p>Now you can run the <code>index.js</code> we created earlier.</p>
<pre><code class="hljs language-sh">node index.js</code></pre>
</template>