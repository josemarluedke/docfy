import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @action
  didTransition() {
    if (
      window &&
      typeof window.scrollTo === 'function'
    ) {
      window.scrollTo(0, 0);
    }
  }
}