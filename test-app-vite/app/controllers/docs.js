import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class DocsController extends Controller {
  @tracked currentHeadingId;

  @action
  setCurrentHeadingId(id) {
    this.currentHeadingId = id;
  }
}