// Easily allow apps, which are not yet using strict mode templates, to consume your Glint types, by importing this file.
// Add all your components, helpers and modifiers to the template registry here, so apps don't have to do this.
// See https://typed-ember.gitbook.io/glint/environments/ember/authoring-addons

import type DocfyDemo from './components/docfy-demo.gts';
import type DocfyLink from './components/docfy-link.gts';
import type DocfyOutput from './components/docfy-output.gts';
import type DocfyPreviousAndNextPage from './components/docfy-previous-and-next-page.gts';

export default interface Registry {
  DocfyDemo: typeof DocfyDemo;
  DocfyLink: typeof DocfyLink;
  DocfyOutput: typeof DocfyOutput;
  DocfyPreviousAndNextPage: typeof DocfyPreviousAndNextPage;
}