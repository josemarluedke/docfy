import DocfyLink from 'test-app-vite/components/docfy-link';

<template>
  <h1 id="docfydemo"><a href="#docfydemo">{{"<DocfyDemo>"}}</a></h1>
<p>This component is used internally to render demos. It's not meant to be used directly,
although that's possible. The scope of what you want to understand is the CSS
classes such that you can style the parts of the demo component yourself.</p>
<p>Make sure to look at <DocfyLink @to="/docs/ember/writing-demos"  >writing demos</DocfyLink>, so you can understand how demos look.</p>
<p>Below is an example of how styling could look like. It uses
<a href="https://tailwindcss.com/">TailwindCSS</a> and <a href="https://github.com/postcss/postcss-nested">PostCSS Nested</a>.</p>
<pre><code class="hljs language-css"><span class="hljs-selector-class">.docfy-demo__example</span> {
  <span class="hljs-keyword">@apply</span> p-<span class="hljs-number">4</span> border rounded-t;
}

<span class="hljs-selector-class">.docfy-demo__description</span> {
  <span class="hljs-keyword">@apply</span> p-<span class="hljs-number">4</span> border-l border-r;

  &#x26;__header {
    <span class="hljs-keyword">@apply</span> flex justify-between;

    &#x26;__title {
      <span class="hljs-keyword">@apply</span> mb-<span class="hljs-number">4</span> font-medium leading-tight text-gray-<span class="hljs-number">900</span>;
    }

    &#x26;__edit-url {
      <span class="hljs-keyword">@apply</span> text-sm;
    }
  }

  &#x26;__content {
    <span class="hljs-keyword">@apply</span> markdown;
  }
}
<span class="hljs-selector-class">.docfy-demo__snippets</span> {
  &#x26;__tabs {
    <span class="hljs-keyword">@apply</span> px-<span class="hljs-number">2</span> border-l border-r;

    &#x26;__button {
      <span class="hljs-keyword">@apply</span> p-<span class="hljs-number">2</span> mr-<span class="hljs-number">2</span> border-b-<span class="hljs-number">4</span>;

      &#x26;--active,
      &#x26;<span class="hljs-selector-pseudo">:hover</span> {
        <span class="hljs-keyword">@apply</span> border-blue-<span class="hljs-number">500</span>;
      }
    }
  }
}

<span class="hljs-selector-class">.docfy-demo__snippet</span> {
  pre {
    <span class="hljs-keyword">@apply</span> p-<span class="hljs-number">4</span>;
    <span class="hljs-keyword">@apply</span> flex text-gray-<span class="hljs-number">200</span> bg-gray-<span class="hljs-number">800</span>;
    <span class="hljs-keyword">@apply</span> text-sm leading-normal;
    <span class="hljs-keyword">@apply</span> font-mono;
    <span class="hljs-keyword">@apply</span> rounded-b;
    scrollbar-<span class="hljs-attribute">width</span>: none;
  }
}</code></pre>
</template>