import Component from '@glimmer/component';

interface ButtonArgs {
  /**
   * The HTML type of the button
   *
   * @defaultValue 'button'
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * The appearance of the button
   *
   * @defaultValue 'default'
   */
  appearance?: 'default' | 'outlined' | 'minimal';

  /**
   * The intent of the button
   *
   * @defaultValue 'primary'
   */
  intent?: 'primary' | 'success' | 'warning' | 'danger';

  /**
   * If the button is renderless
   * It allows the consumer to render a link for example
   */
  isRenderless?: boolean;

  size: string;
}

/**
 * The button component
 * @since 1.0.0
 */
export default class Button extends Component<ButtonArgs> {}
