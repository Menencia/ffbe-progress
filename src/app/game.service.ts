import { Injectable } from '@angular/core';
import { MyChallenge } from './models/my_challenge';
import { AngularFirestore } from '@angular/fire/firestore';
import { MyCategory } from './models/my_category';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  total = 0;

  callback: Function;

  constructor(public afs: AngularFirestore) { }

  save(toSet, toDelete, userUid: string, callback: Function) {

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
  }

  updateTotal() {
    this.total -= 1;

    if (this.total === 0) {
      this.callback();
    }
  }
}
