import Component from '@glimmer/component';
import { Sized } from './shared-interfaces';

interface ButtonArgs extends Sized {
  /**
   * The HTML type of the button
   *
   * @defaultValue 'button'
   */
  type?: 'button' | 'submit' | 'reset';
}

export default class ButtonWithExtendedArgs extends Component<ButtonArgs> {}
