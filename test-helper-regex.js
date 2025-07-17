const template = `<DocfyOutput @type="nested" as |node|>
  <ul>
    {{#each node.pages as |page|}}
      <li>
        <DocfyLink @to={{page.url}}>
          {{page.title}}
        </DocfyLink>
     </li>
    {{/each}}

    {{#each node.children as |child|}}
      {{#let (get child.pages 0) as |page|}}
        {{#if page}}
          <li>
            <DocfyLink @to={{page.url}}>
              {{child.label}}
            </DocfyLink>
          </li>
        {{/if}}
      {{/let}}
    {{/each}}
  </ul>
</DocfyOutput>`;

const helperRegex = /\(\s*(get|set|mut|array|hash|concat|fn)\s+/g;
let match;
console.log('Testing helper regex...');
while ((match = helperRegex.exec(template)) !== null) {
  console.log('Found helper:', match[1]);
}