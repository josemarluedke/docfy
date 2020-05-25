import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface SidebarNavArgs {} //eslint-disable-line

export default class SidebarNav extends Component<SidebarNavArgs> {
  @tracked isOpen = false;

  @action toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
