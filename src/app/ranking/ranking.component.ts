import { Component, OnInit } from '@angular/core';
import { Player } from '../models/player';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { DataService } from '../data.service';
import { User } from '../models/user';

@Component({
  selector: 'app-ranking',
  template: `
    <h1>Classement</h1>
    <div *ngFor="let user of users">
      {{ user.name }} / {{ user.points }}
    </div>
  `,
  styles: []
})
export class RankingComponent implements OnInit {

  users: User[];

  constructor(public data: DataService) { }

  ngOnInit() {
    const options = ref => ref.orderBy('points', 'desc');
    this.data.collection('users', options)
      .subscribe((data) => {
        this.users = data as User[];
      });
  }

}
