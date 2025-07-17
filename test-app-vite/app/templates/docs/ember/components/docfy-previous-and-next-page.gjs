import DocfyPreviousAndNextPage from '../components/docfy-previous-and-next-page';

<template>
  <h1 id="docfypreviousandnextpage">{{"<DocfyPreviousAndNextPage>"}}</h1>
<p>This component yields the previous and next page (<code>PageMetadata</code>) if it exists.
The component accepts a single argument called <code>scope</code>. It is used to narrow the
pages that it can link as previous and next.</p>
<p>Scoping the pages is useful if you are building different sections of your docs site;
for example, one section is "Documentation", and another is "Tutorials". This feature
would prevent linking to a page in tutorials from a documentation page.</p>
<h2 id="api">API</h2>
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
<td><code>@scope</code></td>
<td>Filter links by a scope name</td>
<td><code>string</code> | <code>undefined</code></td>
<td></td>
</tr>
</tbody>
</table>
</template>