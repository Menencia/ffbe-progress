import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from './data.service';
import { User } from './models/user';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  total = 0;

  callback: Function;

  constructor(public afs: AngularFirestore, public data: DataService) { }

  save(toSet, toDelete, user: User, points, callback: Function) {

    this.total = toSet.length + toDelete.length;

    this.callback = callback;

    const mychallengesRef = this.afs.doc(`users/${user.uid}`).collection('mychallenges');
    for (const mychallenge of toSet) {
      mychallengesRef
        .doc(mychallenge.challenge)
        .set(mychallenge)
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
      points: points,
      dateRanking: new Date()
    }, { merge: true });
  }

  updateTotal() {
    this.total -= 1;

    if (this.total === 0) {
      this.callback();
    }
  }
}
