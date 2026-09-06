import DocfyDemoPreviewWritingDemos from './writing-demos_gen/docfy-demo-preview-writing-demos.js';
import DocfyDemoEmberWritingDemosDemo1 from './writing-demos_gen/docfy-demo-ember-writing-demos-demo1.js';
import { DocfyDemo } from '@docfy/ember';
import { DocfyLink } from '@docfy/ember';
import { DocfyCodeBlock } from '@docfy/ember';

<template>
  <h1 id="writing-demos"><a href="#writing-demos">Writing Demos</a></h1>
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
<DocfyCodeBlock @language="md"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="md"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold"># Demo of Docfy Demos :D</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">This is a cool feature of Docfy. It is perfect for documenting design systems and</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">component libraries.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">> Note that this text was extracted from the markdown demo file.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```hbs template</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">This is my Demo: &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">this.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>My Link&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```js component</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> Component </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@glimmer/component'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> MyDemo</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Component</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  url</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '/docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```</span></span></code></pre></DocfyCodeBlock>
<p>The demo will be inserted into the owner file as a new section called "Examples";
you can see it below.</p>
<p>Please note that you must pass a metadata to the code block, it can be seen
after the file type in the example above. The meta is used to identify the purpose
of the code block. The possible values are <code>component</code>, <code>template</code>, and <code>styles</code>.</p>
<blockquote>
<p>You can write TypeScript for the component JS as well, if your host app is
configured to support it.</p>
</blockquote>
<h2 id="examples"><a href="#examples">Examples</a></h2>
<DocfyDemo @id="docfy-demo-ember-writing-demos-demo1" as |demo|>
<demo.Description
          @title="Demo of Docfy Demos " @editUrl="https://github.com/josemarluedke/docfy/edit/main/docs/ember/writing-demos-demo/demo1.md">
<p>This is a cool feature of Docfy. It is perfect for documenting design systems and
component libraries.</p>
<blockquote>
<p>Note that this text was extracted from the markdown demo file.</p>
</blockquote>
</demo.Description>
<demo.Example>
<DocfyDemoEmberWritingDemosDemo1 />
</demo.Example>
<demo.Snippets as |Snippet|>
<Snippet @name="template">
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">This is my Demo: &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">this.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>My Link&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
</Snippet>
<Snippet @name="component">
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> Component </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '@glimmer/component'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> class</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> MyDemo</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> extends</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Component</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">  url</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> '/docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span></code></pre></DocfyCodeBlock>
</Snippet>
</demo.Snippets>
</DocfyDemo>
<h2 id="preview-template"><a href="#preview-template">Preview Template</a></h2>
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
<DocfyCodeBlock @language="md"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="md"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```hbs preview-template</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">Click in the link to navigate to the home page: &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'/'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Home&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">```</span></span></code></pre></DocfyCodeBlock>
<p>And here you can see how it looks like when rendered:</p>
<DocfyDemo @id="docfy-demo-preview-writing-demos" as |demo|>
<demo.Example>
<DocfyDemoPreviewWritingDemos />
</demo.Example>
<demo.Snippet @name="preview-template">
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">Click in the link to navigate to the home page: &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'/'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">>Home&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
</demo.Snippet>
</DocfyDemo>
<h2 id="manual-insertion"><a href="#manual-insertion">Manual Insertion</a></h2>
<p>To make getting started with Docfy as simple as possible, by default demos will
be automatically inserted into the owner file under a new section called
"Examples" before the second heading of the page.</p>
<p>If you want more control over how demos are inserted into the page, you can
declare <code>manualDemoInsertion</code> in a markdown page's frontmatter.</p>
<DocfyCodeBlock ><pre><code>---
title: Document with many examples
manualDemoInsertion: true
---
</code></pre></DocfyCodeBlock>
<p>When a page is using <code>manualDemoInsertion</code>, by default no demos are inserted
into the page. Instead, you must provide markers in your markdown that will be
replaced. They follow the form <code>[[demo:name-of-demo]]</code>.</p>
<DocfyCodeBlock @language="md"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="md"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold"># Title here</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">The demo will be inserted after this line.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">[[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline">demo:demo1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">]]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">And the prose of the document will continue exactly how the author wishes.</span></span></code></pre></DocfyCodeBlock>
<p>Sometimes as an author, you want control over where in the page demos will be
inserted, but you don't need to control this location demo by demo. As a
shorthand, you can provide the <code>[[demos-all]]</code> marker to insert all demos.</p>
<DocfyCodeBlock @language="md"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="md"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-light-font-weight:bold;--shiki-dark:#79B8FF;--shiki-dark-font-weight:bold"># Title here</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">All demos go here.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">[[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline">demos-all</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">]]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">Below is the equivalent if you had to mark all demos individually.</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">[[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline">demo:demo1</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">]]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">[[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline">demo:demo2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">]]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">[[</span><span style="--shiki-light:#032F62;--shiki-light-text-decoration:underline;--shiki-dark:#DBEDFF;--shiki-dark-text-decoration:underline">demo:demo3</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">]]</span></span></code></pre></DocfyCodeBlock>
</template>