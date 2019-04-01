import { User } from './user';
import { Rank } from './rank';

export class Player {
  user: User;
  points: number;
  rank: Rank;
  date: Date;
}
