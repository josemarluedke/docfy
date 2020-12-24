import Component from '@glimmer/component';

interface ButtonArgs {
  type: string;
  appearance: string;
}

// eslint-disable-next-line
class NotExportedButton extends Component<ButtonArgs> {}

export class ButtonNotDefault extends Component<ButtonArgs> {}
export default class ButtonDefault extends Component<ButtonArgs> {}
