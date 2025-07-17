import Route from '@ember/routing/route';

export default class TestVirtualRoute extends Route {
  async model() {
    try {
      console.log('Testing virtual module import...');
      const docfyOutput = await import('virtual:docfy-output');
      console.log('Virtual module imported successfully:', docfyOutput);
      return { success: true, data: docfyOutput };
    } catch (error) {
      console.error('Error importing virtual module:', error);
      return { success: false, error: error.message };
    }
  }
}