import { Injectable } from '@angular/core';
import { MyChallenge } from './models/my_challenge';
import { AngularFirestore } from '@angular/fire/firestore';
import { MyCategory } from './models/my_category';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(public afs: AngularFirestore) { }

  save(mycategories: MyCategory[], userUid: string) {
    const mychallengesRef = this.afs.doc(`users/${userUid}`).collection('mychallenges');
    for (const mycategory of mycategories) {
      for (const mychallenge of mycategory.mychallenges) {
        if (mychallenge.changed && mychallenge.done) {
          mychallengesRef.doc(mychallenge.challenge.uid).set(mychallenge.export());
        } else if (mychallenge.changed && !mychallenge.done) {
          mychallengesRef.doc(mychallenge.challenge.uid).delete();
        }
      }
    }
  }
}
