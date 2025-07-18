import Route from '@ember/routing/route';

export default class DocsRoute extends Route {
  async model() {
    // Import the virtual module
    const docfyOutput = await import('virtual:docfy-output');

    // Load URLs from JSON asset
    const response = await fetch('/docfy-urls.json');
    const urls = await response.json();

    return {
      navigation: docfyOutput.default.nested,
      urls: urls
    };
  }
}
