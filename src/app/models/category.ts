import { Model } from './model';
import { Challenge } from './challenge';

export class Category extends Model {
  uid: string;
  name: {fr: string};
  position: number;

  challenges: Challenge[];

  constructor(categoryObj) {
    super(categoryObj, {
      name: {fr: null},
      position: null,
    });

    this.challenges = [];
  }

}
