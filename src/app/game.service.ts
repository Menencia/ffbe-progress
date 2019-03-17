import { Injectable } from '@angular/core';
import { MyChallenge } from './models/my_challenge';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(public afs: AngularFirestore) { }

  save(challenges: MyChallenge[], userUid: string) {
    const challengeRef = this.afs.doc(`mychallenges/${userUid}`);
    const items = challenges.filter(challenge => challenge.done).map(challenge => challenge.export());
    challengeRef.set({items}, {merge: false});
  }
}
