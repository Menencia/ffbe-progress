import { Challenge } from './challenge';

export class MyChallenge {
  done: boolean;
  nbMissions: number;

  constructor(public challenge: Challenge) {
    this.done = false;
    this.nbMissions = 0;
  }
}
