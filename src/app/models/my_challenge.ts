import { Challenge } from './challenge';

export class MyChallenge {
  done: boolean;
  nbMissions: number;

  constructor(public challenge: Challenge, done = false, nbMissions = 0) {
    this.done = done;
    this.nbMissions = nbMissions;
  }

  getPts() {
    let pts = 0;

    const maxPts = this.challenge.points;

    if (this.done) {
      pts += maxPts;
    }

    if (this.challenge.missions) {
      pts += Math.floor(maxPts / 3 * this.nbMissions);
    }

    return pts;
  }

  getTotalPts() {

    let pts = this.challenge.points;

    if (this.challenge.missions) {
      pts *= 2;
    }

    return pts;
  }

  export() {
    return {
      challenge: this.challenge.uid,
      nbMissions: this.nbMissions,
    };
  }
}
