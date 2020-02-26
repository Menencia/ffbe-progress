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

  dones() {
    let res = 0;
    for (const mych of this.mychallenges) {
      if (mych.done) {
        res += 1 + mych.nbMissions;
      }
    }
    return res;
  }

  totalMissionsAndChallenges() {
    let res = 0;
    for (const mych of this.mychallenges) {
      res += 1 + (mych.challenge.missions ? 3 : 0);
    }
    return res;
  }

  progress() {
    let totalPoints = this.totalPoints();
    let res = 0;

    if (totalPoints > 0) {
      res = Math.floor(this.points() / totalPoints * 100);
    } else {
      res = Math.floor(this.dones() / this.totalMissionsAndChallenges() * 100);
    }

    return res;
  }

}
