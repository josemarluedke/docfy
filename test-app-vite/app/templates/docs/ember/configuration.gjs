import { DocfyLink } from '@docfy/ember';

<template>
  <h1 id="configuration"><a href="#configuration">Configuration</a></h1>
<p>Docfy has a set of options you can configure and might have read about them
<DocfyLink @to="/docs/configuration"  >here</DocfyLink>. You might have been wondering how
to set these options in the Ember app context.</p>
<p>The Docfy integration with Ember reads a file named <code>.docfy-config.js</code> from the
root of your app to set the config.</p>
<p>In this file, you can add any Remark Plugins, add markdown file sources, and more.</p>
<p>Below is a example of a configuration file.</p>
<pre><code class="hljs language-js"><span class="hljs-comment">// .docfy-config.js</span>

<span class="hljs-keyword">const</span> path = <span class="hljs-built_in">require</span>(<span class="hljs-string">'path'</span>);
<span class="hljs-keyword">const</span> autolinkHeadings = <span class="hljs-built_in">require</span>(<span class="hljs-string">'remark-autolink-headings'</span>);
<span class="hljs-keyword">const</span> highlight = <span class="hljs-built_in">require</span>(<span class="hljs-string">'remark-highlight.js'</span>);
<span class="hljs-keyword">const</span> codeImport = <span class="hljs-built_in">require</span>(<span class="hljs-string">'remark-code-import'</span>);

<span class="hljs-built_in">module</span>.exports = {
  <span class="hljs-attr">remarkPlugins</span>: [[autolinkHeadings, { <span class="hljs-attr">behavior</span>: <span class="hljs-string">'wrap'</span> }], codeImport, highlight],
  <span class="hljs-attr">sources</span>: [
    {
      <span class="hljs-attr">root</span>: path.resolve(__dirname, <span class="hljs-string">'../../../docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlSchema</span>: <span class="hljs-string">'manual'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
    },
    {
      <span class="hljs-attr">root</span>: path.join(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlSchema</span>: <span class="hljs-string">'manual'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs/ember'</span>,
    },
  ],
  <span class="hljs-attr">labels</span>: {
    <span class="hljs-attr">components</span>: <span class="hljs-string">'Components'</span>,
    <span class="hljs-attr">core</span>: <span class="hljs-string">'@docfy/core'</span>,
    <span class="hljs-attr">ember</span>: <span class="hljs-string">'@docfy/ember-cli'</span>,
    <span class="hljs-attr">docs</span>: <span class="hljs-string">'Documentation'</span>,
  },
};</code></pre>
<blockquote>
<p>You are not required to create this file. If Docfy cannot find it, we will
use a default configuration. By default markdown files are read from <code>docs</code>
in the root of the Ember app.</p>
</blockquote>
</template>