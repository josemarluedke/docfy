// Utility functions (same as original ember implementation)
export function replaceNode(
  nodes: unknown,
  nodeToDelete: any,
  ...newNodes: any[]
): void {
  if (Array.isArray(nodes)) {
    const index = nodes.findIndex((item) => item === nodeToDelete);
    if (index !== -1) {
      nodes.splice(index, 1, ...newNodes);
    }
  }
}

export function createDemoNodes(component: {
  name: { dashCase: string; pascalCase: string };
  chunks: { code: string; type: string }[];
}): any[] {
  const templateCode = component.chunks[0].code
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return [
    {
      type: 'html',
      value: `<DocfyDemo @id="${component.name.dashCase}" as |demo|>`
    },
    { type: 'html', value: '<demo.Example>' },
    { type: 'html', value: `<${component.name.pascalCase} />` },
    { type: 'html', value: '</demo.Example>' },
    { type: 'html', value: '<demo.Snippets as |Snippet|>' },
    { type: 'html', value: '<Snippet @name="preview">' },
    {
      type: 'html',
      value: `<pre><code class="language-gjs">${templateCode}</code></pre>`
    },
    { type: 'html', value: '</Snippet>' },
    { type: 'html', value: '</demo.Snippets>' },
    { type: 'html', value: '</DocfyDemo>' }
  ];
}
