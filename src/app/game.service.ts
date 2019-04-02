import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  total = 0;

  callback: Function;

  constructor(public afs: AngularFirestore, public data: DataService) { }

  save(toSet, toDelete, userUid: string, points, callback: Function) {

    this.total = toSet.length + toDelete.length;

    this.callback = callback;

    const mychallengesRef = this.afs.doc(`users/${userUid}`).collection('mychallenges');
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
    this.afs.doc(`players/${userUid}`).set({
      points: points,
      date: new Date()
    });
  }

  updateTotal() {
    this.total -= 1;

    if (this.total === 0) {
      this.callback();
    }
  }
}
