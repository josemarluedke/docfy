import DocfyDemoPreviewWritingDemos from './writing-demos_gen/docfy-demo-preview-writing-demos.js';
import DocfyDemoWritingDemosDemo1 from './writing-demos_gen/docfy-demo-writing-demos-demo1.js';
import DocfyDemo from 'test-app-vite/components/docfy-demo';
import DocfyLink from 'test-app-vite/components/docfy-link';


<template>
  <h1 id="writing-demos">Writing Demos</h1>
<p>Docfy has a concept of "demo" markdown files. It allows you to write code in
markdown and have them be extracted as executable code in the host app. You can
learn more about the file location rules in <DocfyLink @to="/docs/writing-markdown" @anchor="demos" >Writing Markdown - Demos</DocfyLink>.</p>
<p>In the context of Ember, all demos are extracted as components. These components
can have a template, component, and style code block. Components can also be
template only components by only specifying the HBS template.</p>
<blockquote>
<p>Note that styles will be extracted as a co-located file with the component,
it would only work if your host app is using <a href="https://github.com/salsify/ember-css-modules">Ember CSS Modules</a>
or something similar.</p>
</blockquote>
<p>Below you can see how a demo markdown file looks like.</p>
<pre><code class="language-md"></code></pre>
<p>The demo will be inserted into the owner file as a new section called "Examples";
you can see it below.</p>
<p>Please note that you must pass a metadata to the code block, it can be seen
after the file type in the example above. The meta is used to identify the purpose
of the code block. The possible values are <code>component</code>, <code>template</code>, and <code>styles</code>.</p>
<blockquote>
<p>You can write TypeScript for the component JS as well, if your host app is
configured to support it.</p>
</blockquote>
<h2 id="examples">Examples</h2>
<DocfyDemo @id="docfy-demo-writing-demos-demo1" as |demo|>
<demo.Description
          @title="Demo of Docfy Demos :D" @editUrl="https://github.com/josemarluedke/docfy/edit/main/packages/ember/docs/writing-demos-demo/demo1.md">
<p>This is a cool feature of Docfy. It is perfect for documenting design systems and
component libraries.</p>
<blockquote>
<p>Note that this text was extracted from the markdown demo file.</p>
</blockquote>
</demo.Description>
<demo.Example>
<DocfyDemoWritingDemosDemo1 />
</demo.Example>
<demo.Snippets as |Snippet|>
<Snippet @name="template">
<pre><code class="language-hbs">This is my Demo: &#x3C;DocfyLink @to=\{{this.url}}>My Link&#x3C;/DocfyLink>
</code></pre>
</Snippet>
<Snippet @name="component">
<pre><code class="language-js">import Component from '@glimmer/component';

export default class MyDemo extends Component {
  url = '/docs';
}
</code></pre>
</Snippet>
</demo.Snippets>
</DocfyDemo>
<h2 id="preview-template">Preview Template</h2>
<p>When writing documentation in Ember apps, we might want to write some template
code to demonstrate how to use a component whilst also having the code
executed to embed the same template into the rendered markdown. Creating a
demo markdown might be too much of an effort; for this purpose, Docfy has
another feature called <code>preview-template</code>. It will extract the template from
the markdown code block and create a component backed by an empty Glimmer
component class to provide a <code>this</code> context so helpers such as <code>mut</code> or <code>set</code>
can be used within the demonstration. It will also add the code snippet so
users can see the code.</p>
<p>Below is an example of how it works:</p>
<pre><code class="language-md">```hbs preview-template
Click in the link to navigate to the home page: &#x3C;DocfyLink @to="/">Home&#x3C;/DocfyLink>
```
</code></pre>
<p>And here you can see how it looks like when rendered:</p>
<DocfyDemo @id="docfy-demo-preview-writing-demos" as |demo|>
<demo.Example>
<DocfyDemoPreviewWritingDemos />
</demo.Example>
<demo.Snippet @name="preview-template">
<pre><code class="language-hbs">Click in the link to navigate to the home page: &#x3C;DocfyLink @to="/">Home&#x3C;/DocfyLink>
</code></pre>
</demo.Snippet>
</DocfyDemo>
<h2 id="manual-insertion">Manual Insertion</h2>
<p>To make getting started with Docfy as simple as possible, by default demos will
be automatically inserted into the owner file under a new section called
"Examples" before the second heading of the page.</p>
<p>If you want more control over how demos are inserted into the page, you can
declare <code>manualDemoInsertion</code> in a markdown page's frontmatter.</p>
<pre><code>---
title: Document with many examples
manualDemoInsertion: true
---
</code></pre>
<p>When a page is using <code>manualDemoInsertion</code>, by default no demos are inserted
into the page. Instead, you must provide markers in your markdown that will be
replaced. They follow the form <code>[[demo:name-of-demo]]</code>.</p>
<pre><code class="language-md"># Title here

The demo will be inserted after this line.

[[demo:demo1]]

And the prose of the document will continue exactly how the author wishes.
</code></pre>
<p>Sometimes as an author, you want control over where in the page demos will be
inserted, but you don't need to control this location demo by demo. As a
shorthand, you can provide the <code>[[demos-all]]</code> marker to insert all demos.</p>
<pre><code class="language-md"># Title here

All demos go here.

[[demos-all]]

Below is the equivalent if you had to mark all demos individually.

[[demo:demo1]]

[[demo:demo2]]

[[demo:demo3]]
</code></pre>
</template>