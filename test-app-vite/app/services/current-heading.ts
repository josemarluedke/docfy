import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentHeadingService extends Service {
  @tracked currentHeadingId?: string;

  setCurrentHeadingId(id: string): void {
    this.currentHeadingId = id;
  }
}