import { babel } from '@rollup/plugin-babel';
import { Addon } from '@embroider/addon-dev/rollup';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { readFileSync, readdirSync } from 'node:fs';

const addon = new Addon({
  srcDir: 'src',
  destDir: 'dist',
});

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const babelConfig = resolve(rootDirectory, './babel.publish.config.cjs');
const tsConfig = resolve(rootDirectory, './tsconfig.json');

/**
 * `addon.keepAssets()` only preserves a `.css` file that some JS module in
 * the rollup graph actually imports (it hooks `load`/`transform` for ids
 * rollup already visits). `@docfy/ember/code-block.css` is meant to be
 * imported directly by a consumer's own CSS (e.g.
 * `@import '@docfy/ember/code-block.css';`), not by any of this package's own
 * JS, so nothing ever pulls it into the graph and `keepAssets` alone never
 * emits it — the file silently never reached `dist/`, even though
 * `package.json#exports` maps `./*.css` to `./dist/*.css`. This plugin copies
 * every top-level `src/*.css` file into `dist/` directly via `emitFile`,
 * independent of the module graph, so it ships regardless of whether
 * anything in this package imports it.
 */
function emitTopLevelCss() {
  return {
    name: 'emit-top-level-css',
    buildStart() {
      const srcDir = resolve(rootDirectory, 'src');
      const cssFiles = readdirSync(srcDir).filter(file => file.endsWith('.css'));

      for (const file of cssFiles) {
        const id = resolve(srcDir, file);
        this.addWatchFile(id);
        this.emitFile({
          type: 'asset',
          fileName: file,
          source: readFileSync(id),
        });
      }
    },
  };
}

export default {
  // This provides defaults that work well alongside `publicEntrypoints` below.
  // You can augment this if you need to.
  output: addon.output(),

  external: ['@docfy/ember/output:virtual'],

  plugins: [
    // These are the modules that users should be able to import from your
    // addon. Anything not listed here may get optimized away.
    // By default all your JavaScript modules (**/*.js) will be importable.
    // But you are encouraged to tweak this to only cover the modules that make
    // up your addon's public API. Also make sure your package.json#exports
    // is aligned to the config here.
    // See https://github.com/embroider-build/embroider/blob/main/docs/v2-faq.md#how-can-i-define-the-public-exports-of-my-addon
    addon.publicEntrypoints(['**/*.js', 'index.js', 'template-registry.js']),

    // These are the modules that should get reexported into the traditional
    // "app" tree. Things in here should also be in publicEntrypoints above, but
    // not everything in publicEntrypoints necessarily needs to go here.
    addon.appReexports([
      'components/**/*.js',
      'helpers/**/*.js',
      'modifiers/**/*.js',
      'services/**/*.js',
    ]),

    // Follow the V2 Addon rules about dependencies. Your code can import from
    // `dependencies` and `peerDependencies` as well as standard Ember-provided
    // package names.
    addon.dependencies(),

    // This babel config should *not* apply presets or compile away ES modules.
    // It exists only to provide development niceties for you, like automatic
    // template colocation.
    //
    // By default, this will load the actual babel config from the file
    // babel.config.json.
    babel({
      extensions: ['.js', '.gjs', '.ts', '.gts'],
      babelHelpers: 'bundled',
      configFile: babelConfig,
    }),

    // Ensure that standalone .hbs files are properly integrated as Javascript.
    addon.hbs(),

    // Ensure that .gjs files are properly integrated as Javascript
    addon.gjs(),

    // Emit .d.ts declaration files
    addon.declarations(
      'declarations',
      `npx glint --declaration --project ${tsConfig}`,
    ),

    // addons are allowed to contain imports of .css files, which we want rollup
    // to leave alone and keep in the published output.
    addon.keepAssets(['**/*.css']),

    // `code-block.css` is a standalone stylesheet meant for a consumer to
    // `@import` directly, not something this package's own JS imports — so
    // `keepAssets` above never sees it. This copies it (and any sibling
    // top-level CSS) into `dist/` unconditionally.
    emitTopLevelCss(),

    // Remove leftover build artifacts when starting a new build.
    addon.clean(),
  ],
};
