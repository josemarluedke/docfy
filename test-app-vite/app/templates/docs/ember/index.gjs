import { DocfyLink } from '@docfy/ember';

<template>
  <h1 id="getting-started"><a href="#getting-started">Getting Started</a></h1>
<p>Docfy brings powerful documentation capabilities to Ember.js applications with a modern, modular architecture. Whether you're building a component library, design system, or comprehensive documentation site, Docfy provides the tools you need.</p>
<h2 id="how-it-works"><a href="#how-it-works">How It Works</a></h2>
<p>Docfy transforms your markdown files into live, interactive documentation with executable component demos. You write markdown, and Docfy generates Ember routes, components, and data structures automatically.</p>
<pre><code class="hljs language-md"><span class="hljs-section"># Button Component</span>

Our primary button component supports multiple variants.

<span class="hljs-code">```gjs preview
import Component from '@glimmer/component';
import { Button } from '@frontile/buttons';

export default class ButtonDemo extends Component {
  // Component logic here

  &#x3C;template>
    &#x3C;Button @variant="primary" @size="large">
      Click me!
    &#x3C;/Button>
  &#x3C;/template>
}
```</span></code></pre>
<p>This becomes a live, interactive demo in your documentation site.</p>
<h2 id="choose-your-build-system"><a href="#choose-your-build-system">Choose Your Build System</a></h2>
<p>Docfy's modular architecture supports different Ember build systems:</p>
<h3 id="classic-ember-cli--docfyember-cli"><a href="#classic-ember-cli--docfyember-cli">Classic Ember CLI → <DocfyLink @to="/docs/ember/ember-cli"  >@docfy/ember-cli</DocfyLink></a></h3>
<p>Perfect for traditional Ember applications. Processes markdown during the Ember CLI build phase with full prember support for static site generation.</p>
<h3 id="modern-vite-builds--docfyember-vite"><a href="#modern-vite-builds--docfyember-vite">Modern Vite Builds → <DocfyLink @to="/docs/ember/ember-vite"  >@docfy/ember-vite</DocfyLink></a></h3>
<p>Built for <code>@embroider/vite</code>. Offers lightning-fast development builds with hot module replacement for instant markdown updates.</p>
<p>Both integrations use the same runtime components from <code>@docfy/ember</code>, ensuring consistent APIs regardless of your build system choice.</p>
<h2 id="what-you-get"><a href="#what-you-get">What You Get</a></h2>
<ul>
<li><strong>Live Component Demos</strong> - Write component examples in markdown that become executable demos</li>
<li><strong>Smart Navigation</strong> - Auto-generated routing with previous/next page navigation</li>
<li><strong>Rich Metadata</strong> - Extract headings, edit links, and custom frontmatter</li>
<li><strong>Flexible Styling</strong> - Unstyled components that adapt to your design system</li>
<li><strong>TypeScript Support</strong> - Full type safety across all packages</li>
</ul>
<h2 id="next-steps"><a href="#next-steps">Next Steps</a></h2>
<p>Ready to add Docfy to your Ember app? Follow our <DocfyLink @to="/docs/ember/tutorial"  >Tutorial</DocfyLink> to create your first documentation site.</p>
<p>If you're upgrading from a previous version, check the <DocfyLink @to="/docs/ember/upgrade-guide"  >Upgrade Guide</DocfyLink> for detailed instructions.</p>
</template>