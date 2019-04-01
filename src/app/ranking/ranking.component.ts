import { Component, OnInit } from '@angular/core';
import { Player } from '../models/player';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-ranking',
  template: `
    <h1>Classement</h1>
    <div *ngFor="let player of players">
      {{ player.user.name }}
    </div>
  `,
  styles: []
})
export class RankingComponent implements OnInit {

  players: Player[];

  constructor(public afs: AngularFirestore) { }

  ngOnInit() {
    const options = ref => ref.orderBy('points', 'desc');
    const playersRef = this.afs.collection('players', options)
    playersRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        return {...data};
      }))
    ).subscribe((data) => {
      console.log(data);
    });
  }

}
