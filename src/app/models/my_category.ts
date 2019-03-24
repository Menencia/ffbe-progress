import { Category } from './category';
import { MyChallenge } from './my_challenge';

export class MyCategory {

  category: Category;
  mychallenges: MyChallenge[];

  constructor(category) {
    this.category = category;
    this.mychallenges = [];
  }

}
