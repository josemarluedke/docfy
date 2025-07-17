<template>
  <h1 id="docfyoutput">{{"<DocfyOutput>"}}</h1>
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
<h2 id="api">API</h2>
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