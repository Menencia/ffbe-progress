import { Category } from './category';

export class Challenge {
  uid: string;
  label: string;
  missions: boolean;
  points: number;
  category: Category;
}
