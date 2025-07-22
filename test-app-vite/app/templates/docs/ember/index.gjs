<template>
  <h1 id="getting-started-with-ember"><a href="#getting-started-with-ember">Getting Started with Ember</a></h1>
<p>Let's get started by creating a new Ember app and adding Docfy to it. For adding
to existing apps, jump to the step after creating the app.</p>
<h2 id="generate-the-app"><a href="#generate-the-app">Generate the App</a></h2>
<p>There isn't anything special here; just create the ember app and remove the
<code>&#x3C;WelcomePage /></code> from <code>application.hbs</code>.</p>
<pre><code>ember new docfy-example
cd docfy-example
</code></pre>
<h2 id="add-docfy-dependency"><a href="#add-docfy-dependency">Add Docfy dependency</a></h2>
<pre><code>yarn add -D @docfy/ember-cli
// or
npm install --dev @docfy/ember-cli
</code></pre>
<h2 id="add-docfy-routes"><a href="#add-docfy-routes">Add Docfy Routes</a></h2>
<p>Docfy has a function that adds all the routes to your Ember app. It understands
the output of Docfy Core and process all the page URLs to add their paths to the Ember app.</p>
<p>In your <code>app/router.js</code> import <code>import { addDocfyRoutes } from '@docfy/ember-cli';</code>
then add <code>addDocfyRoutes(this)</code> to the Router Map. The final result looks like the following:</p>
<pre><code class="hljs language-js"><span class="hljs-keyword">import</span> EmberRouter <span class="hljs-keyword">from</span> <span class="hljs-string">'@ember/routing/router'</span>;
<span class="hljs-keyword">import</span> config <span class="hljs-keyword">from</span> <span class="hljs-string">'./config/environment'</span>;
<span class="hljs-keyword">import</span> { addDocfyRoutes } <span class="hljs-keyword">from</span> <span class="hljs-string">'@docfy/ember-cli'</span>;

<span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-class"><span class="hljs-keyword">class</span> <span class="hljs-title">Router</span> <span class="hljs-keyword">extends</span> <span class="hljs-title">EmberRouter</span> </span>{
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(<span class="hljs-function"><span class="hljs-keyword">function</span> (<span class="hljs-params"></span>) </span>{
  addDocfyRoutes(<span class="hljs-built_in">this</span>);
});</code></pre>
<h2 id="add-markdown-files"><a href="#add-markdown-files">Add Markdown Files</a></h2>
<p>Let's add some markdown files so that we can see it in our app.</p>
<p>Create a folder named <code>docs</code> in the root of your app then place the following content to <code>index.md</code>.</p>
<pre><code class="hljs language-md"><span class="hljs-section"># Hello from my docs site using Docfy</span>

<span class="hljs-strong">**Lorem Ipsum**</span> is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when
an unknown printer took a galley of type and scrambled it to make a type specimen book</code></pre>
<p>Let's add another file called <code>installation.md</code>.</p>
<pre><code class="hljs language-md"><span class="hljs-section"># Installation</span>

Follow the steps below to install my app:

<span class="hljs-bullet">1.</span> <span class="hljs-code">`yarn install`</span>
<span class="hljs-bullet">2.</span> <span class="hljs-code">`yarn start`</span>
<span class="hljs-bullet">3.</span> Done.</code></pre>
<h2 id="start-the-server"><a href="#start-the-server">Start the Server</a></h2>
<p>You can now start the Ember server and visit the docs page.</p>
<pre><code class="hljs language-sh">ember serve</code></pre>
<p>The server will be running on port <code>4200</code>, and the docs path will be <code>/docs</code>.
Here is the full URL: <a href="http://localhost:4200/docs">http://localhost:4200/docs</a>.</p>
<p>To visit the second document we created earlier, you can access
<a href="http://localhost:4200/docs/installation">http://localhost:4200/docs/installation</a>.</p>
<p>That's it, you now have a full working app with Docfy generating pages from
markdown files.</p>
<h2 id="add-a-sidebar"><a href="#add-a-sidebar">Add a Sidebar</a></h2>
<p>Docfy provides several low-level components that help you build the documentation site.
Docfy does not offer any styles by default; our philosophy is to provide all the
pieces for you to develop your docs site with your styles. This approach is perfect
for building design systems that use the styles from your design in your docs.</p>
<p>We can add a <code>docs</code> template that will be used when rendering any documentation
page because of Ember's routing and templating patterns.</p>
<p>In your <code>app/templates/docs.hbs</code> add the following:</p>
<pre><code class="hljs language-hbs"><span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyOutput</span> @<span class="hljs-attr">scope</span>=<span class="hljs-string">'docs'</span> <span class="hljs-attr">as</span> |<span class="hljs-attr">node</span>|></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">ul</span>></span>
    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">each</span></span> node.pages <span class="hljs-keyword">as</span> |page|}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;<span class="hljs-name">li</span>></span>
        <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">page.url</span>}}</span><span class="xml"><span class="hljs-tag">></span>
          </span><span class="hljs-template-variable">\{{<span class="hljs-name">page.title</span>}}</span><span class="xml">
        <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
      <span class="hljs-tag">&#x3C;/<span class="hljs-name">li</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">each</span></span>}}</span><span class="xml">
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">ul</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyOutput</span>></span>

<span class="hljs-tag">&#x3C;<span class="hljs-name">div</span>></span>
  </span><span class="hljs-template-variable">\{{<span class="hljs-name"><span class="hljs-builtin-name">outlet</span></span>}}</span><span class="xml">
<span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span></span></code></pre>
<p>This example uses two components, <code>DocfyOutput</code> and <code>DocfyLink</code>. It is also
the simplest navigation component we can build, ignoring any nested sections
you might define. You can learn more about these components and their capabilities
in their respective documentation page.</p>
<h2 id="add-previous-and-next-page-links"><a href="#add-previous-and-next-page-links">Add Previous and Next Page Links</a></h2>
<p>Documentation sites usually have a previous and next page link. Docfy provides a component that gives you the ability to add this feature.</p>
<p>At the end of the <code>docs.hbs</code> file, add the following:</p>
<pre><code class="hljs language-hbs"><span class="xml"><span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyPreviousAndNextPage</span> <span class="hljs-attr">as</span> |<span class="hljs-attr">previous</span> <span class="hljs-attr">next</span>|></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span>></span>
    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">if</span></span> previous}}</span><span class="xml">
      Previous:

      <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">previous.url</span>}}</span><span class="xml"><span class="hljs-tag">></span>
        </span><span class="hljs-template-variable">\{{<span class="hljs-name">previous.title</span>}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">if</span></span>}}</span><span class="xml">
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>
  <span class="hljs-tag">&#x3C;<span class="hljs-name">div</span>></span>
    </span><span class="hljs-template-tag">\{{#<span class="hljs-name"><span class="hljs-builtin-name">if</span></span> next}}</span><span class="xml">
      Next:

      <span class="hljs-tag">&#x3C;<span class="hljs-name">DocfyLink</span> @<span class="hljs-attr">to</span>=</span></span><span class="hljs-template-variable">\{{<span class="hljs-name">next.url</span>}}</span><span class="xml"><span class="hljs-tag">></span>
        </span><span class="hljs-template-variable">\{{<span class="hljs-name">next.title</span>}}</span><span class="xml">
      <span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyLink</span>></span>
    </span><span class="hljs-template-tag">\{{/<span class="hljs-name"><span class="hljs-builtin-name">if</span></span>}}</span><span class="xml">
  <span class="hljs-tag">&#x3C;/<span class="hljs-name">div</span>></span>
<span class="hljs-tag">&#x3C;/<span class="hljs-name">DocfyPreviousAndNextPage</span>></span></span></code></pre>
<h2 id="other-features"><a href="#other-features">Other Features</a></h2>
<p>Docfy has other abilities that we haven't covered here. For example, we can build
a section that displays "on this page", which lists all the headings in the document.
Another example is adding a link to edit the markdown file on GitHub. Another
useful feature is the ability to demo components out of markdown files. These
features are covered throughout the docs.</p>
</template>