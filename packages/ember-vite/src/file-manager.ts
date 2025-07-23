import type { PluginContext } from 'rollup';
import type { ResolvedConfig } from 'vite';
import type { FileToGenerate } from './types.js';
import path from 'path';
import fs from 'fs';
import debugFactory from 'debug';

const debug = debugFactory('@docfy/ember-vite:file-manager');

export class FileManager {
  private config: ResolvedConfig;
  private context?: PluginContext;

  constructor(config: ResolvedConfig, context?: PluginContext) {
    this.config = config;
    this.context = context;
  }

  isDevMode(): boolean {
    return this.config.command === 'serve';
  }

  writeFiles(files: FileToGenerate[]): void {
    // Always write to disk so Embroider can process the files
    // Never emit as final assets - these are intermediate files
    this.writeFilesToDisk(files);
  }

  writeJsonToPublic(data: any, fileName: string = 'docfy-urls.json'): void {
    const content = JSON.stringify(data);

    if (this.isDevMode()) {
      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(path.join(publicDir, fileName), content);
      debug('Wrote JSON to public folder (dev)', { fileName });
    } else {
      this.context?.emitFile({
        type: 'asset',
        fileName,
        source: content,
      });
      debug('Emitted JSON asset (build)', { fileName });
    }
  }

  private writeFilesToDisk(files: FileToGenerate[]): void {
    files.forEach(file => {
      const fullPath = path.join(process.cwd(), file.path);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(fullPath, file.content);
      debug('Wrote file to disk', { path: file.path });
    });
  }

  emitStaticAssets(staticAssets: any[]): void {
    if (!this.context || this.isDevMode()) {
      return;
    }

    staticAssets.forEach(asset => {
      this.context!.emitFile({
        type: 'asset',
        fileName: asset.toPath,
        source: fs.readFileSync(asset.fromPath),
      });
    });

    debug('Emitted static assets', { count: staticAssets.length });
  }
}
