import { Category } from './category';
import { MyChallenge } from './my_challenge';

export class MyCategory {

  category: Category;
  mychallenges: MyChallenge[];

  constructor(category) {
    this.category = category;
    this.mychallenges = [];
  }

  points() {
    let res = 0;
    for (const mych of this.mychallenges) {
      res += mych.getPts();
    }
    return res;
  }

  totalPoints() {
    let res = 0;
    for (const mych of this.mychallenges) {
      res += mych.getTotalPts();
    }
    return res;
  }

  progress() {
    return Math.floor(this.points() / this.totalPoints() * 100);
  }

}
