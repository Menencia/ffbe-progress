import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../models/user';

@Component({
  selector: 'app-ranking',
  template: `
    <h1>Classement</h1>
    <table class="uk-table uk-table-divider">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Points</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of users">
          <td><a [routerLink]="'/player/' + user.uid">{{ user.name }}</a></td>
          <td>{{ user.points }}pts</td>
          <td>{{ user.dateRanking.toDate() | localizedDate }}</td>
        </tr>
      </tbody>
    </table>
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
