import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { User } from '../models/user';

import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  total = 0;

  callback: Function;

  constructor(public afs: AngularFirestore, public data: DataService) { }

  getTotalPoints(mycategories) {
    let pts = 0;

    for (const mycat of mycategories) {
      for (const mych of mycat.mychallenges) {
        pts += mych.getPts();
      }
    }

    return pts;
  }

  getRank(totalPoints, ranks) {
    let rank = null;
    let i = 0;
    while (totalPoints >= ranks[i].points) {
      i += 1;
      rank = ranks[i];
    }
    if (rank) {
      return `Nv${rank.level}. ${rank.label.fr}`;
    }
    return null;
  }

  save(toSet, toDelete, user: User, points, callback: Function) {

    this.total = toSet.length + toDelete.length;

    this.callback = callback;

    const mychallengesRef = this.afs.doc(`users/${user.uid}`).collection('mychallenges');
    for (const mychallenge of toSet) {
      mychallengesRef
        .doc(mychallenge.c)
        .set({n: mychallenge.n})
        .then(() => this.updateTotal())
        .catch(() => this.updateTotal());
    }
    for (const mychallenge of toDelete) {
      mychallengesRef
        .doc(mychallenge.challenge)
        .delete()
        .then(() => this.updateTotal())
        .catch(() => this.updateTotal());
    }

    // save to /players
    this.afs.doc(`users/${user.uid}`).set({
      rank: {
        points: points,
        date: new Date(),
      }
    }, { merge: true });
  }

  updateTotal() {
    this.total -= 1;

    if (this.total === 0) {
      this.callback();
    }
  }
}
