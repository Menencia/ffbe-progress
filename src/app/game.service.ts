import { Injectable } from '@angular/core';
import { MyChallenge } from './models/my_challenge';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(public afs: AngularFirestore) { }

  save(mychallenges: MyChallenge[], userUid: string) {
    const mychallengesRef = this.afs.doc(`users/${userUid}`).collection('mychallenges');
    for (const mychallenge of mychallenges) {
      if (mychallenge.changed && mychallenge.done) {
        mychallengesRef.doc(mychallenge.challenge.uid).set(mychallenge.export());
      } else if (mychallenge.changed && !mychallenge.done) {
        mychallengesRef.doc(mychallenge.challenge.uid).delete();
      }
    }
  }
}
