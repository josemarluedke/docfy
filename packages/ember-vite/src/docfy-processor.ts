import type { ResolvedConfig } from 'vite';
import type { DocfyConfig, DocfyResult } from '@docfy/core/lib/types';
import Docfy from '@docfy/core';
import { generatePage } from './template-generator.js';
import { FileManager } from './file-manager.js';
import { getDocfySourceFiles } from './utils.js';
import { collectStaticExportFiles, StaticExportOptions } from './static-export.js';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite:processor');

export class DocfyProcessor {
  private config: ResolvedConfig;
  private docfyConfig: DocfyConfig;
  private docfyInstance: Docfy;
  private fileManager: FileManager;
  private currentResult: any = null;
  private staticExport?: StaticExportOptions;

  constructor(
    config: ResolvedConfig,
    docfyConfig: DocfyConfig,
    fileManager: FileManager,
    staticExport?: StaticExportOptions
  ) {
    this.config = config;
    this.docfyConfig = docfyConfig;
    this.docfyInstance = new Docfy(docfyConfig);
    this.fileManager = fileManager;
    this.staticExport = staticExport;
  }

  async processAll(): Promise<any> {
    debug('Processing all markdown files...');

    try {
      const result = await this.docfyInstance.run(this.docfyConfig.sources as any);
      this.currentResult = result;

      debug('Markdown processing completed', {
        contentCount: result.content.length,
        staticAssetsCount: result.staticAssets.length,
      });

      this.generateTemplates(result);
      this.handleAssets(result);
      this.handleStaticExport(result);

      return result;
    } catch (error) {
      debug('Error processing markdown files', { error });
      throw error;
    }
  }

  async processChangedFile(filePath: string): Promise<any> {
    debug('Processing changed file', { filePath });

    try {
      const result = await this.docfyInstance.run(this.docfyConfig.sources as any);
      this.currentResult = result;

      const changedPage = result.content.find((page: any) => {
        return page.vFile.path === filePath;
      });

      if (changedPage) {
        debug('Found changed page', { url: changedPage.meta.url });
        this.generateTemplateForPage(changedPage);
      }

      this.handleAssets(result);
      return result;
    } catch (error) {
      debug('Error processing changed file', { filePath, error });
      throw error;
    }
  }

  async getSourceFiles(): Promise<string[]> {
    return getDocfySourceFiles(this.docfyConfig, process.cwd());
  }

  getCurrentResult(): any {
    return this.currentResult;
  }

  private generateTemplates(result: any): void {
    debug('Generating templates', { pageCount: result.content.length });

    result.content.forEach((page: any) => {
      this.generateTemplateForPage(page);
    });
  }

  private generateTemplateForPage(page: any): void {
    const filesToGenerate = generatePage(page);

    debug('Generated files for page', {
      url: page.meta.url,
      fileCount: filesToGenerate.length,
    });

    this.fileManager.writeFiles(filesToGenerate);
  }

  private handleAssets(result: any): void {
    const urls = result.content.map((page: any) => page.meta.url);
    this.fileManager.writeJsonToPublic(urls);

    if (!this.fileManager.isDevMode()) {
      this.fileManager.emitStaticAssets(result.staticAssets);
    }
  }

  /**
   * Emit the static text mirror of the docs: one `.md` per page plus
   * `llms.txt` / `llms-full.txt`.
   *
   * Build-only. In dev this would write hundreds of generated files into a
   * source directory and rebuild `llms-full.txt` on every markdown save, for
   * output nothing in the running app consumes.
   */
  private handleStaticExport(result: DocfyResult): void {
    if (!this.staticExport?.enabled || this.fileManager.isDevMode()) {
      return;
    }

    const files = collectStaticExportFiles(result, this.staticExport);

    files.forEach(file => {
      this.fileManager.writeTextToPublic(file.content, file.path);
    });

    debug('Emitted static export files', { count: files.length });
  }
}
