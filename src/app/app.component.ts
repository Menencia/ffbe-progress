import { Component, OnInit } from '@angular/core';
import { Challenge } from './models/challenge';
import { MyChallenge } from './models/my_challenge';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <app-login></app-login>
      <app-challenges [challenges]="challenges | async"></app-challenges>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'app';
  challenges: Observable<Challenge[]>;

  constructor(public afs: AngularFirestore) {

  }

  ngOnInit() {
    const challengesRef = this.afs.collection<Challenge>('challenges');
    this.challenges = challengesRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const uid = a.payload.doc.id;
        const data = a.payload.doc.data() as Challenge;
        return {uid, ...data};
      }))
    );
  }
}
