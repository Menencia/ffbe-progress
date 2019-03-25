export class Rank {
  uid: string;
  label: {fr: string};
  level: number;
  points: number;

  constructor(uid, label, level, points) {
    this.uid = uid;
    this.label = label;
    this.level = level;
    this.points = points;
  }

  export() {
    return {
      label: this.label,
      level: this.level,
      points: this.points
    };
  }
}
