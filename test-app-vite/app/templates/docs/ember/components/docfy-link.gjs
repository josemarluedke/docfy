import DocfyLink from '../components/docfy-link';

<template>
  <h1 id="docfylink">{{"<DocfyLink>"}}</h1>
<p>This component is useful for linking to pages created by Docfy. It understands
how the routing in Ember was designed and can correctly link to a given page URL.
If the component is not able to figure out the correct Ember route, it will fall
back to setting <code>windown.location</code> directly.</p>
<p>DocfyLink can also link to an anchor; this allows for linking to specific sections
on a page. Note that linking to an anchor may cause a full-page reload given that
Ember doesn't have support for anchors.</p>
<blockquote>
<p>Docfy also uses this component internally to replace any links between your
markdown files. It gives a pleasant User Experience because it can use the
Ember Routing to make the page transition, removing the need for a full-page reload.</p>
</blockquote>
<p>Below you can see a simple example of this component; however, you can see more
of its usage throughout the documentation.</p>
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
<td><code>@to</code></td>
<td>The URL to link</td>
<td><code>string</code></td>
<td></td>
</tr>
<tr>
<td><code>@anchor</code></td>
<td>An anchor</td>
<td><code>string</code> | <code>undefined</code></td>
<td></td>
</tr>
<tr>
<td><code>@activeClass</code></td>
<td>The classes to be added when the link is active</td>
<td><code>string</code> | <code>undefined</code></td>
<td></td>
</tr>
</tbody>
</table>
</template>