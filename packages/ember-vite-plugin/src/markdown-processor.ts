import type { ResolvedConfig } from 'vite';
import type Docfy from '@docfy/core';
import type { SourceConfig } from '@docfy/core/lib/types';
import path from 'path';
import { generateGJSTemplate } from './gjs-generator';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite-plugin:markdown-processor');

export interface MarkdownProcessResult {
  code: string;
  map?: any;
}

export async function processMarkdown(
  code: string,
  id: string,
  docfyInstance: Docfy,
  config: ResolvedConfig
): Promise<MarkdownProcessResult | null> {
  debug('Processing markdown file', { id });

  try {
    // Determine which source config this file belongs to
    const sourceConfig = findSourceConfigForFile(id, docfyInstance);
    if (!sourceConfig) {
      debug('No source config found for file', { id });
      return null;
    }

    // Run Docfy processing on the single file
    const result = await docfyInstance.run([{
      ...sourceConfig,
      pattern: path.basename(id),
      root: path.dirname(id)
    }]);

    if (!result.content.length) {
      debug('No content generated from markdown file', { id });
      return null;
    }

    const page = result.content[0];
    debug('Generated page', { 
      url: page.meta.url,
      title: page.meta.title,
      hasPluginData: Object.keys(page.pluginData).length > 0
    });

    // Generate GJS template for this page
    const gjsTemplate = generateGJSTemplate(page);

    // In development, we might want to return the template directly
    // In production, we'll emit it as a file
    if (config.command === 'serve') {
      return {
        code: gjsTemplate,
        map: null
      };
    }

    // For build, we'll handle this in the generateBundle hook
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

function findSourceConfigForFile(filePath: string, docfyInstance: Docfy): SourceConfig | null {
  // Access the docfy config sources
  const sources = (docfyInstance as any).context?.options?.sources || [];
  
  for (const source of sources) {
    const sourcePath = path.resolve(source.root);
    const resolvedFilePath = path.resolve(filePath);
    
    if (resolvedFilePath.startsWith(sourcePath)) {
      return source;
    }
  }
  
  return null;
}

export interface ProcessedMarkdownFile {
  id: string;
  content: string;
  meta: any;
  rendered: string;
  demos?: any[];
}