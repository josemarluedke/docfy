import { helper } from '@ember/component/helper';

export function docfyEq(params: unknown[]): boolean {
  return params[0] === params[1];
}

export default helper(docfyEq);
