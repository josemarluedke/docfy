
<template>
  <h1 id="getting-started-with-ember">Getting Started with Ember</h1>
<p>Let's get started by creating a new Ember app and adding Docfy to it. For adding
to existing apps, jump to the step after creating the app.</p>
<h2 id="generate-the-app">Generate the App</h2>
<p>There isn't anything special here; just create the ember app and remove the
<code>&#x3C;WelcomePage /></code> from <code>application.hbs</code>.</p>
<pre><code>ember new docfy-example
cd docfy-example
</code></pre>
<h2 id="add-docfy-dependency">Add Docfy dependency</h2>
<pre><code>yarn add -D @docfy/ember
// or
npm install --dev @docfy/ember
</code></pre>
<h2 id="add-docfy-routes">Add Docfy Routes</h2>
<p>Docfy has a function that adds all the routes to your Ember app. It understands
the output of Docfy Core and process all the page URLs to add their paths to the Ember app.</p>
<p>In your <code>app/router.js</code> import <code>import { addDocfyRoutes } from '@docfy/ember';</code>
then add <code>addDocfyRoutes(this)</code> to the Router Map. The final result looks like the following:</p>
<pre><code class="language-js">import EmberRouter from '@ember/routing/router';
import config from './config/environment';
import { addDocfyRoutes } from '@docfy/ember';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  addDocfyRoutes(this);
});
</code></pre>
<h2 id="add-markdown-files">Add Markdown Files</h2>
<p>Let's add some markdown files so that we can see it in our app.</p>
<p>Create a folder named <code>docs</code> in the root of your app then place the following content to <code>index.md</code>.</p>
<pre><code class="language-md"># Hello from my docs site using Docfy

**Lorem Ipsum** is simply dummy text of the printing and typesetting industry.
Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when
an unknown printer took a galley of type and scrambled it to make a type specimen book
</code></pre>
<p>Let's add another file called <code>installation.md</code>.</p>
<pre><code class="language-md"># Installation

Follow the steps below to install my app:

1. `yarn install`
2. `yarn start`
3. Done.
</code></pre>
<h2 id="start-the-server">Start the Server</h2>
<p>You can now start the Ember server and visit the docs page.</p>
<pre><code class="language-sh">ember serve
</code></pre>
<p>The server will be running on port <code>4200</code>, and the docs path will be <code>/docs</code>.
Here is the full URL: <a href="http://localhost:4200/docs">http://localhost:4200/docs</a>.</p>
<p>To visit the second document we created earlier, you can access
<a href="http://localhost:4200/docs/installation">http://localhost:4200/docs/installation</a>.</p>
<p>That's it, you now have a full working app with Docfy generating pages from
markdown files.</p>
<h2 id="add-a-sidebar">Add a Sidebar</h2>
<p>Docfy provides several low-level components that help you build the documentation site.
Docfy does not offer any styles by default; our philosophy is to provide all the
pieces for you to develop your docs site with your styles. This approach is perfect
for building design systems that use the styles from your design in your docs.</p>
<p>We can add a <code>docs</code> template that will be used when rendering any documentation
page because of Ember's routing and templating patterns.</p>
<p>In your <code>app/templates/docs.hbs</code> add the following:</p>
<pre><code class="language-hbs">&#x3C;DocfyOutput @scope="docs" as |node|>
  &#x3C;ul>
    \{{#each node.pages as |page|}}
      &#x3C;li>
        &#x3C;DocfyLink @to=\{{page.url}}>
          \{{page.title}}
        &#x3C;/DocfyLink>
      &#x3C;/li>
    \{{/each}}
  &#x3C;/ul>
&#x3C;/DocfyOutput>

&#x3C;div>
  \{{outlet}}
&#x3C;/div>
</code></pre>
<p>This example uses two components, <code>DocfyOutput</code> and <code>DocfyLink</code>. It is also
the simplest navigation component we can build, ignoring any nested sections
you might define. You can learn more about these components and their capabilities
in their respective documentation page.</p>
<h2 id="add-previous-and-next-page-links">Add Previous and Next Page Links</h2>
<p>Documentation sites usually have a previous and next page link. Docfy provides a component that gives you the ability to add this feature.</p>
<p>At the end of the <code>docs.hbs</code> file, add the following:</p>
<pre><code class="language-hbs">&#x3C;DocfyPreviousAndNextPage as |previous next|>
  &#x3C;div>
    \{{#if previous}}
      Previous:

      &#x3C;DocfyLink @to=\{{previous.url}}>
        \{{previous.title}}
      &#x3C;/DocfyLink>
    \{{/if}}
  &#x3C;/div>
  &#x3C;div>
    \{{#if next}}
      Next:

      &#x3C;DocfyLink @to=\{{next.url}}>
        \{{next.title}}
      &#x3C;/DocfyLink>
    \{{/if}}
  &#x3C;/div>
&#x3C;/DocfyPreviousAndNextPage>
</code></pre>
<h2 id="other-features">Other Features</h2>
<p>Docfy has other abilities that we haven't covered here. For example, we can build
a section that displays "on this page", which lists all the headings in the document.
Another example is adding a link to edit the markdown file on GitHub. Another
useful feature is the ability to demo components out of markdown files. These
features are covered throughout the docs.</p>
</template>