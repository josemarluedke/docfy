export default function docfyOutputTemplate(modulePrefix: string): string {
  return `;
define('@embroider/virtual/docfy/output', [
  'exports',
  '${modulePrefix}/docfy-output'
], function (_exports, _docfyOutput) {
  'use strict';

  Object.defineProperty(_exports, '__esModule', {
    value: true
  });
  Object.defineProperty(_exports, 'default', {
    enumerable: true,
    get: function () {
      return _docfyOutput.default;
    }
  });
});
`;
}
