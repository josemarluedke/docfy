import DocfyDemoEmberComponentsDocfyOutputSidebar from './docfy-output_gen/docfy-demo-ember-components-docfy-output-sidebar.js';
import DocfyDemoEmberComponentsDocfyOutputOnThisPage from './docfy-output_gen/docfy-demo-ember-components-docfy-output-on-this-page.js';
import DocfyDemoEmberComponentsDocfyOutputEditPage from './docfy-output_gen/docfy-demo-ember-components-docfy-output-edit-page.js';
import DocfyDemoEmberComponentsDocfyOutputTopNav from './docfy-output_gen/docfy-demo-ember-components-docfy-output-top-nav.js';
import DocfyDemoEmberComponentsDocfyOutputFlat from './docfy-output_gen/docfy-demo-ember-components-docfy-output-flat.js';
import { DocfyDemo } from '@docfy/ember';
import { DocfyCodeBlock } from '@docfy/ember';

<template>
  <h1 id="docfyoutput"><a href="#docfyoutput">{{"<DocfyOutput>"}}</a></h1>
<p>This component exposes some of the result data from the build that you can use
to render, for example, a sidebar navigation, "on this page" section, and more.</p>
<p>Depending on the arguments you pass to the component, the output could be one of
the following values:</p>
<ul>
<li><code>NestedPageMetadata</code></li>
<li><code>PageMetadata[]</code></li>
<li><code>PageMetadata</code></li>
<li><code>undefined</code></li>
</ul>
<p>To learn more about each data type, please refer to the API docs.</p>
<p>Below you can see several examples of what is possible to build using this component.</p>
<h2 id="examples"><a href="#examples">Examples</a></h2>
<DocfyDemo @id="docfy-demo-ember-components-docfy-output-sidebar" as |demo|>
<demo.Description
          @title="Sidebar Navigation" @editUrl="https://github.com/josemarluedke/docfy/edit/main/docs/ember/components/docfy-output-demo/sidebar.md">
<p>In this example, we are filtering the <code>NestedPageMetadata</code> by the scope name <code>docs</code>.
Then we use the yielded data to render pages, their children, and their children's
pages. Depending on how your documentation is structured, you might need to render
more deep into the tree or more shadow.</p>
<blockquote>
<p>You might have noticed that for this documentation site, we haven't rendered
too deep into the tree to display all items.</p>
</blockquote>
</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyOutputSidebar />
</demo.Example>
<demo.Snippet @name="template">
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">scope=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'docs'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> as |node|></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'list-disc list-inside space-y-2'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#each</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> node.pages</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> |</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">|</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">          \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page.title</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/each</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#each</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> node.children</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> |</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">child</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">|</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'block ml-4'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'py-2'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">          \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">child.label</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'list-disc list-inside space-y-2'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">          \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#each</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> child.pages</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> |</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">|</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">            &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">              &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">                \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page.title</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">              &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">            &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">          \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/each</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/each</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-ember-components-docfy-output-on-this-page" as |demo|>
<demo.Description
          @title="On this page" @editUrl="https://github.com/josemarluedke/docfy/edit/main/docs/ember/components/docfy-output-demo/on-this-page.md">
<p>In this example, we are using the option <code>@fromCurrentURL</code>. It tells the component
to search for the definition of the page that corresponds to the current URL.
We are then using the <code>headings</code> property, a data structure that represents a
Table of Content. The <code>headings</code> is a recursive data structure, meaning that you
can render their child for subheadings and their sub-subheadings. The depth of
headings available here is default to 6 but can be changed using the configuration
option <code>tocMaxDepth</code>.</p>
</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyOutputOnThisPage />
</demo.Example>
<demo.Snippet @name="template">
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">fromCurrentURL=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">true</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> as |page|></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'mb-4 font-medium'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    On this page:</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">div</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'list-disc list-inside space-y-2'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#each</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> page.headings</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> |</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">heading</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">|</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">a</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> href=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'#</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{heading.id}}</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">          \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">heading.title</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/each</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-ember-components-docfy-output-edit-page" as |demo|>
<demo.Description
          @title="Edit this page" @editUrl="https://github.com/josemarluedke/docfy/edit/main/docs/ember/components/docfy-output-demo/edit-page.md">
<p>This is another example using <code>@fromCurrentURL</code>, but here we build a "edit this
page" link.</p>
<p>For this feature to work, Docfy must be able to find the repository URL. In
Ember apps, we extract that from the <code>package.json</code>, but you can configure the
repository URL as well as the branch to edit.</p>
<p>For this to work, you need to include <code>repository</code> in your docfy-config:</p>
<DocfyCodeBlock @language="js"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="js"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// in your docfy-config.js</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">.</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">exports</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  repository: {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    url: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'https://github.com/@username/repo-name'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    editBranch: </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'main'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  },</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">  ...</span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D">// rest of your config</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">}</span></span></code></pre></DocfyCodeBlock>
<h2 id="enterprise-aka-on-premise-git-services"><a href="#enterprise-aka-on-premise-git-services">Enterprise (aka on premise) git services</a></h2>
<p><code>page.editUrl</code> works for Github, Bitbucket, Gitlab and Sourcehut.</p>
<p>For on-premise instances git solutions (i.e. on-premise Gitlab, or on-premise Bitbucket), we expose the <code>page.relativePath</code> so that you might construct your own custom editUrl:</p>
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">fromCurrentURL=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">true</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> as |page|></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">  \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#if</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> page.relativePath</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">a</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> href=</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(concat </span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">"http://some-enterpise.com/browse/"</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> page.relativePath)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      Click here to edit this page</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;/a></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">  \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
<p>Note: the edit url for your on-premise instance might be more complex than the example above. But the <code>page.relativePath</code> will give you the relative path to that file in your repo.</p>
</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyOutputEditPage />
</demo.Example>
<demo.Snippet @name="template">
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">fromCurrentURL=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">true</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> as |page|></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">  \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#if</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> page.editUrl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">a</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> href=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page.editUrl</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      Click here to edit this page</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">    &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">a</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">  \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-ember-components-docfy-output-top-nav" as |demo|>
<demo.Description
          @title="Top Navigation" @editUrl="https://github.com/josemarluedke/docfy/edit/main/docs/ember/components/docfy-output-demo/top-nav.md">
<p>Here is another example that builds a top nav that could be used for the entire
application. It will link to any top-level pages as well as to the first page of
every child.</p>
</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyOutputTopNav />
</demo.Example>
<demo.Snippet @name="template">
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">type=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'nested'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> as |node|></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#each</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> node.pages</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> |</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">|</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">          \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page.title</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/each</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#each</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> node.children</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> |</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">child</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">|</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">      \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#let</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">get</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> child.pages</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> 0</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">) </span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> |</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">|</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">        \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#if</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> page</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">          &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">            &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">              \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">child.label</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">            &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">          &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">        \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/if</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">      \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/let</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/each</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
</demo.Snippet>
</DocfyDemo>
<DocfyDemo @id="docfy-demo-ember-components-docfy-output-flat" as |demo|>
<demo.Description
          @title="Flat output" @editUrl="https://github.com/josemarluedke/docfy/edit/main/docs/ember/components/docfy-output-demo/flat.md">
<p>This option will return an array of <code>PageMetadata</code>. It will contain all the
pages in a flat array, one could render a list of all the pages without worrying
about the scope.</p>
</demo.Description>
<demo.Example>
<DocfyDemoEmberComponentsDocfyOutputFlat />
</demo.Example>
<demo.Snippet @name="template">
<DocfyCodeBlock @language="hbs"><pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0" data-language="handlebars"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">type=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'flat'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> as |pages|></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> class=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'list-disc list-inside space-y-2'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">#each</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70"> pages</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> as</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> |</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">|</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> @</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">to=</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">\{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page.url</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">          \{{</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">page.title</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">        &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyLink</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">      &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">li</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">    \{{</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">/each</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF">}}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">  &#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">ul</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">&#x3C;/</span><span style="--shiki-light:#22863A;--shiki-dark:#85E89D">DocfyOutput</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">></span></span></code></pre></DocfyCodeBlock>
</demo.Snippet>
</DocfyDemo>
<h2 id="api"><a href="#api">API</a></h2>
<p>This component has a few different options that are used to filter what the
returning value should be. Here is the arguments this component accepts.</p>
<table>
<thead>
<tr>
<th>Argument</th>
<th>Description</th>
<th>Type</th>
<th>Default Value</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>@type</code></td>
<td>If the result should be a flat list or nested</td>
<td><code>'flat'</code> | <code>'nested'</code></td>
<td><code>'nested'</code></td>
</tr>
<tr>
<td><code>@fromCurrentURL</code></td>
<td>If the result should be filtered from the current URL</td>
<td><code>boolean</code> | <code>undefined</code></td>
<td></td>
</tr>
<tr>
<td><code>@url</code></td>
<td>Find the page definition for the given URL</td>
<td><code>string</code> | <code>undefined</code></td>
<td></td>
</tr>
<tr>
<td><code>@scope</code></td>
<td>If the result should be filtered by an scope name</td>
<td><code>string</code> | <code>undefined</code></td>
<td></td>
</tr>
</tbody>
</table>
</template>