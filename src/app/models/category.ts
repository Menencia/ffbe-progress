import { Model } from './model';

export class Category extends Model {
  uid: string;
  name: {fr: string};
  position: number;

  constructor(categoryObj) {
    super(categoryObj, {
      name: {fr: null},
      position: null,
    });
  }

}
