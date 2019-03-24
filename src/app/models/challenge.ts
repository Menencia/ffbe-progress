import { Category } from './category';

export class Challenge {
  uid: string;
  label: {fr: string};
  missions: boolean;
  points: number;
  position: number;
  category: Category;

  constructor(uid, label, missions, points, position, category) {
    this.uid = uid;
    this.label = label;
    this.missions = missions;
    this.points = points;
    this.position = position;
    this.category = category;
  }

  export() {
    return {
      label: this.label,
      missions: this.missions,
      points: this.points,
      position: this.position,
      category: this.category.uid
    };
  }
}
