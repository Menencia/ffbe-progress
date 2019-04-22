import { Component, OnInit } from '@angular/core';

import { User } from '../models/user';

import { DataService } from '../services/data.service';

@Component({
  selector: 'app-ranking',
  template: `
    <h2 class="uk-heading-divider">Classement</h2>
    <table class="uk-table uk-table-divider" *ngIf="users && users.length > 0; else noUsers">
      <thead>
        <tr>
          <th></th>
          <th>Nom</th>
          <th>Points</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let user of users; let i = index">
          <td>#{{ i + 1 }}</td>
          <td><a [routerLink]="user.getProfileLink()">{{ user.getName() }}</a></td>
          <td>{{ user.rank.points }}pts</td>
          <td>{{ user.rank.date.toDate() | localizedDate }}</td>
        </tr>
      </tbody>
    </table>

    <ng-template #noUsers>
      Pas de données.
    </ng-template>
  `,
  styles: []
})
export class RankingComponent implements OnInit {

  users: User[];

  constructor(public data: DataService) { }

  ngOnInit() {
    this.data.getUsersRanking()
      .subscribe((users: User[]) => {
        this.users = [];
        for (const user of users) {
          if (user.rank && user.rank.points) {
            this.users.push(user);
          }
        }
      });
  }

}
