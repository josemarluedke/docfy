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

### **Phase 1: Foundation Setup** ✅

#### ✅ Step 1: Create New Package Structure

- [x] Create `packages/ember-vite-plugin/` directory
- [x] Set up `package.json` with dependencies:
  - `@docfy/core` (reuse existing core)
  - `vite` (peer dependency)
  - `@rollup/pluginutils` (for file filtering)
  - `@embroider/vite` (peer dependency)
- [x] Create `tsconfig.json` for TypeScript configuration

#### ✅ Step 2: Core Plugin Architecture

- [x] Create `packages/ember-vite-plugin/src/index.ts` with multi-plugin structure
- [x] Implement base plugin that returns array of plugins (dev/build specific)
- [x] Set up virtual module system for Docfy outputs
- [x] Add proper TypeScript types and exports

### **Phase 2: Core Functionality Migration** ✅

#### ✅ Step 3: Migrate Broccoli Logic to Vite Hooks

- [x] Replace `DocfyBroccoli` class with Vite plugin hooks:
  - [x] `buildStart()` → Initialize Docfy instance
  - [x] `transform()` → Process markdown files
  - [x] `generateBundle()` → Emit static assets
  - [x] `resolveId()/load()` → Handle virtual modules
- [x] Create `src/markdown-processor.ts` for markdown transformation

#### ✅ Step 4: Virtual Module System Implementation

- [x] Create virtual modules for:
  - [x] `virtual:docfy-output` (equivalent to current `docfy-output.js`)
  - [x] `virtual:docfy-urls` (replaces `docfy-urls.json`)
  - [x] `virtual:docfy-snippets` (replaces `docfy-snippets.json`)
- [x] Create `src/virtual-modules.ts` with full virtual module system
- [x] Add asset generation and HMR invalidation support

#### ✅ Step 5: Component Generation System

- [x] Transform current file writing logic to use `this.emitFile()`
- [x] Generate demo components as Vite chunks/assets, these will need to be compiled by Embroider Vite build system.
- [x] Maintain current template-only component fallback logic
- [x] Create `src/gjs-generator.ts` with modern GJS component generation
- [x] Support both `<template>` syntax and `setComponentTemplate` patterns

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
- to test the application, run `DEBUG=@docfy/ember-vite-plugin* yarn start` inside `test-app-vite`.

## Files Created

### Phase 1 & 2 Implementation Files

- ✅ `packages/ember-vite-plugin/package.json` - Package configuration with dependencies
- ✅ `packages/ember-vite-plugin/tsconfig.json` - TypeScript configuration
- ✅ `packages/ember-vite-plugin/src/index.ts` - Main plugin entry point with multi-plugin architecture
- ✅ `packages/ember-vite-plugin/src/virtual-modules.ts` - Virtual module system for Docfy outputs
- ✅ `packages/ember-vite-plugin/src/config.ts` - Configuration loading (CJS/ESM compatible)
- ✅ `packages/ember-vite-plugin/src/markdown-processor.ts` - Markdown file transformation
- ✅ `packages/ember-vite-plugin/src/gjs-generator.ts` - GJS component generation with modern patterns
- ✅ `packages/ember-vite-plugin/src/utils.ts` - Utility functions for string manipulation

---

## Phase 6B: Enhanced GJS Template Generation (NEW)

### Overview
Instead of handling demos as a special case, we need a more general approach that can handle:
- Import statements at the top of GJS files
- Inline component definitions
- Preview templates
- Additional content before the main template
- General markdown extraction patterns

### New Page Data Structure

We'll extend the page data to capture these general concepts:

```typescript
interface EnhancedPageContent extends PageContent {
  gjsMetadata: {
    imports: ImportStatement[];
    inlineComponents: InlineComponent[];
    additionalContent: string;
    templateContent: string; // The main HTML/HBS content
  };
}

interface ImportStatement {
  type: 'component' | 'helper' | 'modifier' | 'service' | 'other';
  name: string;
  path: string;
  isDefault: boolean;
  namedImports?: string[];
}

interface InlineComponent {
  name: string;
  type: 'template-only' | 'class-based' | 'const-template';
  template: string;
  script?: string;
  imports?: ImportStatement[];
}
```

### Implementation Plan

#### Step 6B.1: Create Enhanced Page Processing Plugin
- **File**: `packages/ember-vite-plugin/src/plugins/enhance-page-metadata.ts`
- **Purpose**: Process markdown content and extract GJS metadata
- **Responsibilities**:
  - Parse markdown for import statements (future feature)
  - Extract demo components and convert to inline components
  - Process preview-template blocks
  - Identify additional content blocks
  - Structure data for template generation

#### Step 6B.2: Update Plugin Architecture
- **File**: `packages/ember-vite-plugin/src/plugins/index.ts`
- **Purpose**: Centralize plugin management
- **Includes**:
  - `enhance-page-metadata.ts` - Extract GJS metadata
  - `process-demos.ts` - Convert demo components to inline components
  - `process-preview-templates.ts` - Handle preview-template blocks
  - `extract-imports.ts` - Future: Extract imports from markdown (placeholder)

#### Step 6B.3: Enhanced GJS Template Generator
- **File**: `packages/ember-vite-plugin/src/gjs-generator.ts` (updated)
- **Purpose**: Generate GJS files using structured metadata
- **Template Structure**:
  ```typescript
  function generateGJSTemplate(page: EnhancedPageContent): string {
    return `
// === IMPORTS SECTION ===
${page.gjsMetadata.imports.map(imp => generateImportStatement(imp)).join('\n')}

// === INLINE COMPONENTS SECTION ===
${page.gjsMetadata.inlineComponents.map(comp => generateInlineComponent(comp)).join('\n\n')}

// === ADDITIONAL CONTENT SECTION ===
${page.gjsMetadata.additionalContent}

// === MAIN TEMPLATE ===
<template>
  ${page.gjsMetadata.templateContent}
</template>
`;
  }
  ```

#### Step 6B.4: Demo Processing Plugin
- **File**: `packages/ember-vite-plugin/src/plugins/process-demos.ts`
- **Purpose**: Convert demo components to inline components
- **Process**:
  1. Find demo components in `page.pluginData.demoComponents`
  2. Convert each demo to an `InlineComponent`
  3. Add to `page.gjsMetadata.inlineComponents`
  4. Generate component usage in main template

#### Step 6B.5: Preview Template Plugin
- **File**: `packages/ember-vite-plugin/src/plugins/process-preview-templates.ts`
- **Purpose**: Convert preview-template blocks to inline components
- **Process**:
  1. Find `preview-template` code blocks in markdown
  2. Extract template content
  3. Generate inline component with empty class
  4. Add to `page.gjsMetadata.inlineComponents`
  5. Replace code block with component usage

#### Step 6B.6: Import Extraction Plugin (Future)
- **File**: `packages/ember-vite-plugin/src/plugins/extract-imports.ts`
- **Purpose**: Extract import statements from markdown
- **Process**:
  1. Parse markdown for import blocks or special syntax
  2. Extract component imports, helpers, etc.
  3. Add to `page.gjsMetadata.imports`
  4. Remove import blocks from template content

### Benefits of This Approach

1. **Separation of Concerns**: Each plugin handles one specific aspect
2. **Extensibility**: Easy to add new features (imports, other content types)
3. **Maintainability**: Clear data structure and processing pipeline
4. **Testability**: Each plugin can be tested independently
5. **Future-Proof**: Ready for import extraction and other features

### Migration Strategy

1. **Phase 1**: Implement enhanced page metadata structure
2. **Phase 2**: Create demo processing plugin
3. **Phase 3**: Create preview-template plugin
4. **Phase 4**: Update GJS generator to use structured metadata
5. **Phase 5**: Add import extraction capability (future)

### Example Output

```javascript
// Generated GJS file
import Component from '@glimmer/component';
import DocfyLink from '../docfy-link';

// Demo component from demo1.md
const Demo1 = <template>
  This is my Demo: <DocfyLink @to={{this.url}}>My Link</DocfyLink>
</template>;

// Demo component class with logic
class Demo1Class extends Component {
  url = '/docs';
}
Object.assign(Demo1, Demo1Class.prototype);

// Preview template component
const PreviewExample = <template>
  Click in the link to navigate to the home page: <DocfyLink @to="/">Home</DocfyLink>
</template>;

<template>
  <h1>Writing Demos</h1>
  <p>Documentation content...</p>
  
  <h2>Examples</h2>
  <Demo1 />
  
  <h2>Preview Template</h2>
  <PreviewExample />
</template>
```

**Status**: Phase 1 & 2 Complete ✅  
**Current**: Implementing Phase 6B - Enhanced GJS Template Generation  
**Next Step**: Create enhanced page processing plugin architecture
