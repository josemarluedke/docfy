declare module 'broccoli-file-creator' {
  import Plugin from 'broccoli-plugin';

  export default class WriteFile extends Plugin {
    constructor(
      filename: string,
      content: string,
      _options?: Record<string, unknown>
    );
  }
}
