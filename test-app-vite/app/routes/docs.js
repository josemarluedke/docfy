import Route from '@ember/routing/route';

export default class DocsRoute extends Route {
  async model() {
    // Import the virtual modules
    const [docfyOutput, docfyUrls] = await Promise.all([
      import('virtual:docfy-output'),
      import('virtual:docfy-urls')
    ]);

    return {
      navigation: docfyOutput.default.nested,
      urls: docfyUrls.default
    };
  }
}