import { DocfyLink } from '@docfy/ember';

<template>
  <h1 id="tutorial"><a href="#tutorial">Tutorial</a></h1>
<p>Let's create your first Docfy documentation site! This guide walks you through setting up a new Ember app with Docfy, but you can also add Docfy to an existing application.</p>
<h2 id="create-a-new-ember-app"><a href="#create-a-new-ember-app">Create a New Ember App</a></h2>
<pre><code class="hljs language-bash">ember new my-docs-site
<span class="hljs-built_in">cd</span> my-docs-site
</code></pre>
<p>Remove the <code>&#x3C;WelcomePage /></code> from <code>app/templates/application.hbs</code> if present.</p>
<h2 id="install-docfy"><a href="#install-docfy">Install Docfy</a></h2>
<p>Choose your build integration and install both packages:</p>
<p><strong>For Classic Ember CLI:</strong></p>
<pre><code class="hljs language-bash">npm install --save-dev @docfy/ember-cli
npm install @docfy/ember
</code></pre>
<p><strong>For Vite Builds:</strong></p>
<pre><code class="hljs language-bash">npm install --save-dev @docfy/ember-vite
npm install @docfy/ember
</code></pre>
<h2 id="configure-your-build"><a href="#configure-your-build">Configure Your Build</a></h2>
<h3 id="ember-cli-configuration"><a href="#ember-cli-configuration">Ember CLI Configuration</a></h3>
<p>Create <code>.docfy-config.js</code> in your project root:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">const</span> path = <span class="hljs-built_in">require</span>(<span class="hljs-string">'path'</span>);

<span class="hljs-variable language_">module</span>.<span class="hljs-property">exports</span> = {
  <span class="hljs-attr">sources</span>: [
    {
      <span class="hljs-attr">root</span>: path.<span class="hljs-title function_">join</span>(__dirname, <span class="hljs-string">'docs'</span>),
      <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
      <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
    },
  ],
};
</code></pre>
<h3 id="vite-configuration"><a href="#vite-configuration">Vite Configuration</a></h3>
<p>Add the plugin to your <code>vite.config.mjs</code>:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> { defineConfig } <span class="hljs-keyword">from</span> <span class="hljs-string">'vite'</span>;
<span class="hljs-keyword">import</span> docfy <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-vite'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title function_">defineConfig</span>({
  <span class="hljs-attr">plugins</span>: [
    <span class="hljs-title function_">docfy</span>(
      <span class="hljs-comment">/** <span class="hljs-doctag">@type</span> {<span class="hljs-type">import('@docfy/ember-vite').DocfyViteOptions</span>} */</span>
      {
        <span class="hljs-attr">root</span>: process.<span class="hljs-title function_">cwd</span>(),
        <span class="hljs-attr">hmr</span>: <span class="hljs-literal">true</span>,
        <span class="hljs-attr">config</span>: {
          <span class="hljs-attr">sources</span>: [
            {
              <span class="hljs-attr">root</span>: <span class="hljs-string">'.'</span>,
              <span class="hljs-attr">pattern</span>: <span class="hljs-string">'**/*.md'</span>,
              <span class="hljs-attr">urlPrefix</span>: <span class="hljs-string">'docs'</span>,
            },
          ],
        },
      }
    ),
    <span class="hljs-comment">// ... other plugins</span>
  ],
});
</code></pre>
<h2 id="add-routes"><a href="#add-routes">Add Routes</a></h2>
<p>Update your <code>app/router.js</code> to include Docfy routes:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> <span class="hljs-title class_">EmberRouter</span> <span class="hljs-keyword">from</span> <span class="hljs-string">'@ember/routing/router'</span>;
<span class="hljs-keyword">import</span> config <span class="hljs-keyword">from</span> <span class="hljs-string">'./config/environment'</span>;
<span class="hljs-keyword">import</span> { addDocfyRoutes } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Router</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_ inherited__">EmberRouter</span> {
  location = config.<span class="hljs-property">locationType</span>;
  rootURL = config.<span class="hljs-property">rootURL</span>;
}

<span class="hljs-title class_">Router</span>.<span class="hljs-title function_">map</span>(<span class="hljs-keyword">function</span> (<span class="hljs-params"></span>) {
  <span class="hljs-title function_">addDocfyRoutes</span>(<span class="hljs-variable language_">this</span>);
});
</code></pre>
<h2 id="create-your-first-docs"><a href="#create-your-first-docs">Create Your First Docs</a></h2>
<p>Create a <code>docs</code> folder in your project root and add <code>docs/index.md</code>:</p>
<pre><code class="hljs language-md">---
<span class="hljs-section">title: Welcome
---</span>

<span class="hljs-section"># Welcome to My Documentation</span>

This is my first Docfy documentation site!

<span class="hljs-section">## Getting Started</span>

You can create more pages by adding markdown files to the <span class="hljs-code">`docs`</span> folder.
</code></pre>
<p>Add another page at <code>docs/installation.md</code>:</p>
<pre><code class="hljs language-md">---
<span class="hljs-section">title: Installation
---</span>

<span class="hljs-section"># Installation</span>

Follow these steps to install the project:

<span class="hljs-bullet">1.</span> Clone the repository
<span class="hljs-bullet">2.</span> Run <span class="hljs-code">`npm install`</span>
<span class="hljs-bullet">3.</span> Start the development server with <span class="hljs-code">`npm start`</span>
</code></pre>
<h2 id="build-navigation"><a href="#build-navigation">Build Navigation</a></h2>
<p>Create <code>app/templates/docs.hbs</code> to add a sidebar:</p>
<pre><code class="hljs language-hbs"><span class="hljs-tag">&#x3C;<span class="hljs-title">div</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'docs-layout'</span>></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-title">aside</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'sidebar'</span>></span>
    <span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyOutput</span> <span class="hljs-punctuation">@</span><span class="hljs-params">scope</span><span class="hljs-operator">=</span><span class="hljs-string">'docs'</span> <span class="hljs-keyword">as</span> |<span class="hljs-template-variable">node</span>|></span>
      <span class="hljs-tag">&#x3C;<span class="hljs-title">nav</span>></span>
        <span class="hljs-punctuation mustache">\{{#<span class="hljs-title"><span class="hljs-built_in">each</span></span> <span class="hljs-title">node</span><span class="hljs-punctuation">.</span><span class="hljs-title">pages</span> <span class="hljs-keyword">as</span> |<span class="hljs-template-variable">page</span>|}}</span>
          <span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyLink</span> <span class="hljs-punctuation">@</span><span class="hljs-params">to</span><span class="hljs-operator">=</span><span class="hljs-punctuation mustache">\{{<span class="hljs-title">page</span><span class="hljs-punctuation">.</span><span class="hljs-title">url</span>}}</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'nav-link'</span>></span>
            <span class="hljs-punctuation mustache">\{{<span class="hljs-title">page</span><span class="hljs-punctuation">.</span><span class="hljs-title">title</span>}}</span>
          <span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyLink</span>></span>
        <span class="hljs-punctuation mustache">\{{/<span class="hljs-title"><span class="hljs-built_in">each</span></span>}}</span>
      <span class="hljs-tag">&#x3C;/<span class="hljs-title">nav</span>></span>
    <span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyOutput</span>></span>
  <span class="hljs-tag">&#x3C;/<span class="hljs-title">aside</span>></span>

  <span class="hljs-tag">&#x3C;<span class="hljs-title">main</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'content'</span>></span>
    <span class="hljs-punctuation mustache">\{{<span class="hljs-title"><span class="hljs-keyword">outlet</span></span>}}</span>

    <span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyPreviousAndNextPage</span> <span class="hljs-keyword">as</span> |<span class="hljs-template-variable">previous</span> <span class="hljs-template-variable">next</span>|></span>
      <span class="hljs-tag">&#x3C;<span class="hljs-title">div</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'page-nav'</span>></span>
        <span class="hljs-punctuation mustache">\{{#<span class="hljs-title"><span class="hljs-built_in">if</span></span> <span class="hljs-title">previous</span>}}</span>
          <span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyLink</span> <span class="hljs-punctuation">@</span><span class="hljs-params">to</span><span class="hljs-operator">=</span><span class="hljs-punctuation mustache">\{{<span class="hljs-title">previous</span><span class="hljs-punctuation">.</span><span class="hljs-title">url</span>}}</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'prev-link'</span>></span>
            ←
            <span class="hljs-punctuation mustache">\{{<span class="hljs-title">previous</span><span class="hljs-punctuation">.</span><span class="hljs-title">title</span>}}</span>
          <span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyLink</span>></span>
        <span class="hljs-punctuation mustache">\{{/<span class="hljs-title"><span class="hljs-built_in">if</span></span>}}</span>
        <span class="hljs-punctuation mustache">\{{#<span class="hljs-title"><span class="hljs-built_in">if</span></span> <span class="hljs-title">next</span>}}</span>
          <span class="hljs-tag">&#x3C;<span class="hljs-title">DocfyLink</span> <span class="hljs-punctuation">@</span><span class="hljs-params">to</span><span class="hljs-operator">=</span><span class="hljs-punctuation mustache">\{{<span class="hljs-title">next</span><span class="hljs-punctuation">.</span><span class="hljs-title">url</span>}}</span> <span class="hljs-attribute">class</span><span class="hljs-operator">=</span><span class="hljs-string">'next-link'</span>></span>
            <span class="hljs-punctuation mustache">\{{<span class="hljs-title">next</span><span class="hljs-punctuation">.</span><span class="hljs-title">title</span>}}</span>
            →
          <span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyLink</span>></span>
        <span class="hljs-punctuation mustache">\{{/<span class="hljs-title"><span class="hljs-built_in">if</span></span>}}</span>
      <span class="hljs-tag">&#x3C;/<span class="hljs-title">div</span>></span>
    <span class="hljs-tag">&#x3C;/<span class="hljs-title">DocfyPreviousAndNextPage</span>></span>
  <span class="hljs-tag">&#x3C;/<span class="hljs-title">main</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-title">div</span>></span>
</code></pre>
<h2 id="start-your-server"><a href="#start-your-server">Start Your Server</a></h2>
<pre><code class="hljs language-bash">ember serve
</code></pre>
<p>Visit <code>http://localhost:4200/docs</code> to see your documentation site!</p>
<h2 id="next-steps"><a href="#next-steps">Next Steps</a></h2>
<p>Now that you have a basic documentation site running:</p>
<ul>
<li>Learn about <DocfyLink @to="/docs/ember/writing-demos"  >Writing Demos</DocfyLink> to create interactive component examples</li>
<li>Explore the <DocfyLink @to="/docs/ember/components/docfy-output"  >DocfyOutput component</DocfyLink> for advanced navigation</li>
<li>Check out specific build integration guides for <DocfyLink @to="/docs/ember/ember-cli"  >Ember CLI</DocfyLink> or <DocfyLink @to="/docs/ember/ember-vite"  >Vite</DocfyLink></li>
</ul>
<p>Your documentation site will grow as you add more markdown files to the <code>docs</code> folder. Each file becomes a page with automatic routing and navigation.</p>
</template>