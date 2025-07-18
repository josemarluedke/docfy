import type { ResolvedConfig } from 'vite';
import type { DocfyProcessor } from './docfy-processor.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite:markdown-processor');

export interface MarkdownProcessResult {
  code: string;
  map?: any;
}

export async function processMarkdown(
  code: string,
  id: string,
  processor: DocfyProcessor,
  config: ResolvedConfig
): Promise<MarkdownProcessResult | null> {
  debug('Processing markdown file', { id });

  try {
    const result = processor.getCurrentResult();

    if (!result?.content.length) {
      debug('No content available from processor', { id });
      return null;
    }

    const page = result.content.find((p: any) => p.vFile.path === id);
    if (!page) {
      debug('No matching page found for file', { id });
      return null;
    }

    debug('Found page for file', {
      url: page.meta.url,
      title: page.meta.title,
      hasPluginData: Object.keys(page.pluginData || {}).length > 0
    });

    return {
      code: `// Processed by Docfy - ${page.meta.title}
export default ${JSON.stringify(page.meta)};`,
      map: null
    };
  } catch (error) {
    debug('Error processing markdown file', { id, error });
    throw error;
  }
}

export interface ProcessedMarkdownFile {
  id: string;
  content: string;
  meta: any;
  rendered: string;
  demos?: any[];
}
