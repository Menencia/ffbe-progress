import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Change } from '../models/change';

@Component({
  selector: 'app-changes',
  template: `
    <h2 class="uk-heading-divider">Mises à jour</h2>
    <table class="uk-table uk-table-divider">
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Important</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let change of changes">
        <td>{{ change.date.toDate() | localizedDate }}</td>
        <td>{{ 'CHANGE.' + change.type.toUpperCase() + '_' + change.operation.toUpperCase() | translate:{name: change.name} }}</td>
        <td><span *ngIf="change.important" uk-icon="star"></span></td>
      </tr>
    </tbody>
  </table>
  `,
  styles: []
})
export class ChangesComponent implements OnInit {

  changes: Change[];

  constructor(
    public data: DataService,
  ) { }

  ngOnInit() {
    this.data.getChanges()
      .subscribe(changes => this.changes = changes);
  }

}
