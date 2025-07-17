<template>
  <h1 id="getting-started">Getting Started</h1>
<p>Here you can find a simple getting started with the Docfy Core. The core will
output an object with the processed content, metadata, and some additional data
structures for your convenience.</p>
<h2 id="create-the-project">Create the project</h2>
<pre><code class="language-sh">mkdir docfy-core-getting-started &#x26;&#x26; cd docfy-core-getting-started
</code></pre>
<pre><code class="language-sh">npm init
# or
yarn init
</code></pre>
<h2 id="add-docfycore-as-a-dependency">Add <code>@docfy/core</code> as a dependency</h2>
<pre><code class="language-sh">npm install @docfy/core
# or
yarn add @docfy/core
</code></pre>
<h2 id="initialize-docfy">Initialize Docfy</h2>
<pre><code class="language-js">// index.js
const Docfy = require('@docfy/core');
const path = require('path');

new Docfy()
.run([
{
root: path.join(__dirname, 'docs'),
urlPrefix: 'docs',
pattern: '**/*.md'
}
])
.then((result) => {
console.log(result);
});
</code></pre>
<h2 id="create-a-markdown-file">Create a markdown file</h2>
<pre><code class="language-sh">mkdir docs
echo '# Hello Docfy.' > docs/README.md
</code></pre>
<h2 id="run-your-script">Run your script</h2>
<p>Now you can run the <code>index.js</code> we created earlier.</p>
<pre><code class="language-sh">node index.js
</code></pre>
</template>