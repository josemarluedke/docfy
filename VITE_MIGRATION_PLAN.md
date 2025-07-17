# Docfy Vite Migration Plan

This document outlines the step-by-step plan for creating a Vite-compatible version of the Docfy Ember package to work with @embroider/vite.

## Research Summary

### Current Architecture Analysis

- **Broccoli-based build system** with `DocfyBroccoli` plugin
- **File Generation**: Creates templates (`*.hbs`), components (`*.js`), and JSON outputs
- **Build Hooks**: Uses `treeForApp`, `treeForAddon`, and `treeForPublic`
- **Core Processing**: Leverages `@docfy/core` for markdown processing and plugin architecture

### Vite Integration Strategy

- **Virtual Module System**: Replace file generation with virtual modules
- **Plugin Architecture**: Multi-plugin structure for dev/build environments
- **@embroider/vite Compatibility**: Seamless integration with Embroider's Vite setup
- **Performance**: Incremental processing with HMR support

## Implementation Plan

### **Phase 1: Foundation Setup**

#### ✅ Step 1: Create New Package Structure

- [ ] Create `packages/ember-vite-plugin/` directory
- [ ] Set up `package.json` with dependencies:
  - `@docfy/core` (reuse existing core)
  - `vite` (peer dependency)
  - `@rollup/pluginutils` (for file filtering)
  - `@embroider/vite` (peer dependency)

#### ✅ Step 2: Core Plugin Architecture

- [ ] Create `packages/ember-vite-plugin/src/index.ts` with multi-plugin structure
- [ ] Implement base plugin that returns array of plugins (dev/build specific)
- [ ] Set up virtual module system for Docfy outputs

### **Phase 2: Core Functionality Migration**

#### ✅ Step 3: Migrate Broccoli Logic to Vite Hooks

- [ ] Replace `DocfyBroccoli` class with Vite plugin hooks:
  - [ ] `buildStart()` → Initialize Docfy instance
  - [ ] `transform()` → Process markdown files
  - [ ] `generateBundle()` → Emit static assets
  - [ ] `resolveId()/load()` → Handle virtual modules

#### ✅ Step 4: Virtual Module System Implementation

- [ ] Create virtual modules for:
  - [ ] `virtual:docfy-output` (equivalent to current `docfy-output.js`)
  - [ ] `virtual:docfy-urls` (replaces `docfy-urls.json`)
  - [ ] `virtual:docfy-snippets` (replaces `docfy-snippets.json`)

#### ✅ Step 5: Component Generation System

- [ ] Transform current file writing logic to use `this.emitFile()`
- [ ] Generate demo components as Vite chunks/assets, these will need to be compiled by Embroider Vite build system.
- [ ] Maintain current template-only component fallback logic

### **Phase 3: Ember Integration**

#### ✅ Step 6: Template Generation Strategy

- [ ] **Modern GJS Pattern**: Generate `.gjs` files instead of separate `.hbs` + `.js` files
- [ ] **Embroider Integration**: Let Embroider Vite build system compile the generated GJS components
- [ ] **Template Compilation**: Use modern `<template>` syntax or `setComponentTemplate` pattern
- [ ] Ensure templates are properly registered in Ember's resolver

#### ✅ Step 7: Module System Compatibility

- [ ] Replace AMD module definition (`docfyOutputTemplate`) with ES modules
- [ ] **GJS Component Generation**: Create ES modules that Embroider can process
- [ ] **Module Boundaries**: Emit files in locations where Embroider expects them
- [ ] Ensure proper imports work with Ember's module system

#### ✅ Step 8: Static Asset Handling

- [ ] Implement static asset copying using Vite's `emitFile()`
- [ ] Maintain current asset path structure for backward compatibility
- [ ] Handle public directory assets properly

### **Phase 4: Development Experience**

#### ✅ Step 9: Hot Module Replacement (HMR)

- [ ] Implement HMR for markdown file changes
- [ ] Set up file watching for docs directories
- [ ] Enable incremental processing for performance

#### ✅ Step 10: Configuration Integration

- [ ] Adapt `.docfy-config.js` loading for Vite environment
- [ ] Support both CJS and ESM config formats
- [ ] Maintain backward compatibility with existing configs

### **Phase 5: @embroider/vite Integration**

#### ✅ Step 11: Embroider Compatibility

- [ ] Test plugin with `@embroider/vite` setup
- [ ] Ensure proper integration with Embroider's build process
- [ ] Handle Ember-specific module resolution

#### ✅ Step 12: Route Integration

- [ ] Maintain current `addDocfyRoutes()` functionality
- [ ] Ensure route generation works with Vite build output
- [ ] Test with Ember's router and FastBoot

### **Phase 6: Testing & Validation**

#### ✅ Step 13: Create Test Implementation

- [ ] Set up test Ember app with `@embroider/vite`
- [ ] Create comprehensive test suite for plugin functionality
- [ ] Validate all existing Docfy features work

#### ✅ Step 14: Performance Optimization

- [ ] Implement caching for processed markdown
- [ ] Optimize file watching and incremental builds
- [ ] Profile build times vs. current Broccoli implementation

### **Phase 7: Migration Strategy**

#### ✅ Step 15: Hybrid Addon Support

- [ ] Create feature detection for build system
- [ ] Support both Broccoli and Vite in same addon
- [ ] Provide migration guide for users

#### ✅ Step 16: Documentation & Examples

- [ ] Update documentation for Vite usage
- [ ] Create migration guide from Ember CLI to Vite
- [ ] Provide example configurations

## Key Implementation Details

### Virtual Module Pattern

```javascript
// packages/ember-vite-plugin/src/index.ts
export default function docfyVitePlugin(options = {}) {
  return {
    name: 'docfy-ember-vite-plugin',
    resolveId(id) {
      if (id === 'virtual:docfy-output') {
        return '\0virtual:docfy-output';
      }
    },
    load(id) {
      if (id === '\0virtual:docfy-output') {
        return `export default ${JSON.stringify(
          docfyResult.nestedPageMetadata
        )};`;
      }
    }
  };
}
```

### Modern GJS Component Generation

```javascript
// Generate GJS components with modern <template> syntax
transform(code, id) {
  if (id.endsWith('.md')) {
    const docfyResult = processMarkdown(code, id);

    // Generate GJS components for demo components
    docfyResult.demoComponents.forEach(component => {
      const gjsContent = generateGJSComponent(component);
      this.emitFile({
        type: 'chunk',
        fileName: `components/${component.name.dashCase}.gjs`,
        source: gjsContent
      });
    });

    // Generate GJS template for the markdown page
    const pageTemplate = generatePageTemplate(docfyResult.rendered);
    return {
      code: pageTemplate,
      map: null
    };
  }
}

// Example GJS component generation
function generateGJSComponent(component) {
  // Modern <template> syntax (preferred)
  return `
import Component from '@glimmer/component';

export default class ${component.name.pascalCase} extends Component {
  <template>
    ${component.templateContent}
  </template>
}
`;

  // Alternative: setComponentTemplate pattern
  // return `
  // import { setComponentTemplate } from '@ember/component';
  // import { hbs } from 'ember-cli-htmlbars';
  // import Component from '@glimmer/component';
  //
  // export default class ${component.name.pascalCase} extends Component {}
  // setComponentTemplate(hbs\`${component.templateContent}\`, ${component.name.pascalCase});
  // `;
}
```

## Current Implementation Reference

### Key Files to Reference

- `/packages/ember/src/index.ts` - Main Ember CLI addon implementation
- `/packages/ember/src/get-config.ts` - Configuration loading
- `/packages/ember/src/docfy-output-template.ts` - AMD module template
- `/packages/core/src/index.ts` - Core Docfy processing logic

### Current Build Process

1. `included()` hook initializes config and BroccoliBridge
2. `treeForApp()` creates DocfyBroccoli instance and processes markdown
3. `treeForAddon()` generates output.js with AMD module
4. `treeForPublic()` exposes public assets via Broccoli bridge

## Timeline Estimate

- **Phase 1-2**: 2-3 weeks (Core foundation)
- **Phase 3**: 2-3 weeks (Ember integration)
- **Phase 4-5**: 2-3 weeks (DX and Embroider)
- **Phase 6-7**: 2-3 weeks (Testing and migration)

## Success Criteria

1. ✅ All existing Docfy functionality preserved
2. ✅ Performance improvement over Broccoli implementation
3. ✅ Seamless `@embroider/vite` integration
4. ✅ Backward compatibility maintained
5. ✅ Developer experience enhanced with HMR

## Key Architecture Decisions

### Modern Ember Patterns

- **GJS over HBS**: Generate `.gjs` files instead of separate `.hbs` + `.js` files
- **Embroider Integration**: Let Embroider Vite build system handle compilation
- **Modern Template Syntax**: Use `<template>` syntax for better tooling and TypeScript support

### Build System Integration

- **Work WITH Embroider**: Generate files that Embroider can process, don't bypass it
- **Proper Module Boundaries**: Emit files where Embroider expects them
- **Vite Transform Pipeline**: Use Vite's `transform` hook for markdown → GJS conversion

### Implementation Strategy

- **Virtual Modules**: Replace file system operations with virtual modules
- **Incremental Processing**: Leverage Vite's dev server for fast rebuilds
- **HMR Support**: Enable hot module replacement for markdown changes

## Notes

- Keep `@docfy/core` unchanged - it's framework-agnostic
- Virtual modules replace file system operations
- Maintain current user-facing API and configuration
- Test thoroughly with existing Docfy projects
- **Modern Ember Ecosystem**: Embrace GJS and Embroider patterns

---

**Status**: Planning Complete ✅
**Next Step**: Begin Phase 1 - Foundation Setup
