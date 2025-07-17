import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import docfyVitePlugin from '@docfy/ember-vite-plugin';

export default defineConfig({
  plugins: [
    // Docfy plugin must run BEFORE ember plugin so templates are available
    docfyVitePlugin({
      root: process.cwd(),
      include: ['../docs/**/*.md'],
      exclude: ['node_modules/**'],
      hmr: true,
    }),
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
});
