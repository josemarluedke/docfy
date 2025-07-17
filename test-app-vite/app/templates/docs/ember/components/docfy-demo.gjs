<template>
  <h1 id="docfydemo">{{"<DocfyDemo>"}}</h1>
<p>This component is used internally to render demos. It's not meant to be used directly,
although that's possible. The scope of what you want to understand is the CSS
classes such that you can style the parts of the demo component yourself.</p>
<p>Make sure to look at <a href="/docs/ember/writing-demos">writing demos</a>, so you can understand how demos look.</p>
<p>Below is an example of how styling could look like. It uses
<a href="https://tailwindcss.com/">TailwindCSS</a> and <a href="https://github.com/postcss/postcss-nested">PostCSS Nested</a>.</p>
<pre><code class="language-css">.docfy-demo__example {
@apply p-4 border rounded-t;
}

.docfy-demo__description {
@apply p-4 border-l border-r;

&#x26;__header {
@apply flex justify-between;

&#x26;__title {
@apply mb-4 font-medium leading-tight text-gray-900;
}

&#x26;__edit-url {
@apply text-sm;
}
}

&#x26;__content {
@apply markdown;
}
}
.docfy-demo__snippets {
&#x26;__tabs {
@apply px-2 border-l border-r;

&#x26;__button {
@apply p-2 mr-2 border-b-4;

&#x26;--active,
&#x26;:hover {
@apply border-blue-500;
}
}
}
}

.docfy-demo__snippet {
pre {
@apply p-4;
@apply flex text-gray-200 bg-gray-800;
@apply text-sm leading-normal;
@apply font-mono;
@apply rounded-b;
scrollbar-width: none;
}
}
</code></pre>
</template>