import { Model } from './model';

export class Rank extends Model {
  uid: string;
  label: {fr: string};
  level: number;
  points: number;

  constructor(rankObj) {
    super(rankObj, {
      label: {fr: null},
      level: null,
      points: null,
    });
  }
}
