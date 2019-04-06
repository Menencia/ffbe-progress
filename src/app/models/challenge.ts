import { Category } from './category';
import { Model } from './model';

export class Challenge extends Model {
  uid: string;
  label: {fr: string};
  missions: boolean;
  points: number;
  position: number;
  category: Category;

  constructor(challengeObj) {
    super(challengeObj, {
      label: {fr: null},
      missions: false,
      points: null,
      position: null,
      category: null,
    });
  }

}
