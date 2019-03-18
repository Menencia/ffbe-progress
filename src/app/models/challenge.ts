import { Category } from './category';

export class Challenge {
  uid: string;
  label: {fr: string};
  missions: boolean;
  points: number;
  category: Category;
  position: number;
}
