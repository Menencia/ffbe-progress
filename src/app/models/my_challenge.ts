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
      const missionPt = Math.floor(maxPts / 3);
      pts += missionPt * this.nbMissions;
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
