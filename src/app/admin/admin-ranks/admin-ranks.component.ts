import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import UIkit from 'uikit';

import { Rank } from 'src/app/models/rank';

import { DataService } from 'src/app/services/data.service';
import { ChangeService } from 'src/app/services/change.service';

@Component({
  selector: 'app-admin-ranks',
  template: `
  <table class="uk-table uk-table-divider">
    <thead>
      <tr>
        <th>Nom</th>
        <th>Niveau</th>
        <th>Points</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let r of ranks">
        <td>{{ r.label.fr }}</td>
        <td>{{ r.level }}</td>
        <td>{{ r.points }}</td>
        <td>
          <a uk-icon="pencil" (click)="modifyRank(r)"></a>
          <a uk-icon="trash" (click)="deleteRank(r)"></a>
        </td>
      </tr>
    </tbody>
  </table>

  <a class="uk-button uk-button-default" (click)="addRank()">Ajouter un rang</a>

  <!-- MODAL rank -->
  <div id="modal-rank" uk-modal>
    <div class="uk-modal-dialog uk-modal-body" *ngIf="rank">
      <button class="uk-modal-close-default" type="button" uk-close></button>
      <h4 class="uk-modal-title">{{ title }}</h4>
      <form class="uk-form-horizontal" #ranks="ngForm">

        <div class="uk-margin">
          <div class="uk-form-label uk-text-bold">
            Label*
          </div>
          <div class="uk-form-controls">
            <input class="uk-input"
              id="rName"
              name="rName"
              type="text"
              [(ngModel)]="rank.label.fr"
              #rName="ngModel"
              required>
          </div>
        </div>

        <div class="uk-margin">
          <div class="uk-form-label uk-text-bold">
            Niveau
          </div>
          <div class="uk-form-controls">
            <input class="uk-input"
              id="rLevel"
              name="rLevel"
              type="number"
              [(ngModel)]="rank.level"
              #rLevel="ngModel">
          </div>
        </div>

        <div class="uk-margin">
          <div class="uk-form-label uk-text-bold">
            Points
          </div>
          <div class="uk-form-controls">
            <input class="uk-input"
              id="rPoints"
              name="rPoints"
              type="number"
              [(ngModel)]="rank.points"
              #rPoints="ngModel">
          </div>
        </div>

        <button class="uk-button uk-button-primary uk-align-right"
          [disabled]="!ranks.form.valid"
          (click)="_modifyRank()">Valider</button>
      </form>
    </div>
  </div>
`,
  styles: []
})
export class AdminRanksComponent implements OnInit, OnDestroy {

  public ranks: Rank[] = [];

  public title = 'Éditer un rang';
  public rank: Rank;

  constructor(
    public afs: AngularFirestore,
    public data: DataService,
    public changeService: ChangeService,
  ) { }

  ngOnInit() {
    this.data.getRanks()
      .subscribe(ranks => this.ranks = ranks);
  }

  ngOnDestroy() {
    const modal = document.getElementById('modal-rank');
    if (modal) {
      modal.remove();
    }
  }

  addRank() {
    this.rank = new Rank({});
    UIkit.modal('#modal-rank').show();
  }

  modifyRank(rank) {
    this.rank = rank;
    UIkit.modal('#modal-rank').show();
  }

  _modifyRank() {
    UIkit.modal('#modal-rank').hide();
    if (this.rank.uid) {
      this.afs.doc(`ranks/${this.rank.uid}`).update(this.rank.export());

      // new change
      this.changeService.rankUpdate(`${this.rank.label.fr}`, false);
    } else {
      this.afs.collection('ranks').add(this.rank.export());

      // new change
      this.changeService.rankCreate(`${this.rank.label.fr}`, false);
    }
  }

  deleteRank(rank: Rank) {
    UIkit.modal.confirm('Confirmer?').then(
      () => {
        this.afs.doc(`ranks/${rank.uid}`).delete();

        // new change
        this.changeService.rankDelete(`${this.rank.label.fr}`, false);
      },
      () => {
        // do nothing
      }
    );
  }

}
