import { defineConfig } from 'vite';
import { extensions, classicEmberSupport, ember } from '@embroider/vite';
import { babel } from '@rollup/plugin-babel';
import docfy from '@docfy/ember-vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    // Docfy plugin must run BEFORE ember plugin so templates are available
    docfy({
      root: process.cwd(),
      hmr: true,
    }),
    tailwindcss(),
    classicEmberSupport(),
    ember(),
    babel({
      babelHelpers: 'runtime',
      extensions,
    }),
  ],
  build: {
    minify: false,
  },
});
