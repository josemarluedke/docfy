import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class Docs extends Controller {
  @tracked currentHeadingId: string | undefined;

  @action
  setCurrentHeadingId(id: string | undefined): void {
    this.currentHeadingId = id;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    docs: Docs;
  }
}
