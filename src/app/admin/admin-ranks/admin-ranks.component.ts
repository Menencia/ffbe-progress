import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { map, } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import UIkit from 'uikit';
import { Rank } from 'src/app/models/rank';

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
        <h2 class="uk-modal-title">{{ title }}</h2>
        <p>
          <label for="name">Nom</label>
          <input type="text" [(ngModel)]="rank.label.fr" />
        </p>
        <p>
          <label for="position">Niveau</label>
          <input type="number" [(ngModel)]="rank.level" />
        </p>
        <p>
          <label for="position">Points</label>
          <input type="number" [(ngModel)]="rank.points" />
        </p>
        <p><button (click)="_modifyRank()">Valider</button></p>
    </div>
  </div>
`,
  styles: []
})
export class AdminRanksComponent implements OnInit, OnDestroy {

  public ranks: Rank[] = [];

  public title = 'Rnk';
  public rank: Rank;

  public ranksRef: AngularFirestoreCollection;

  constructor(public afs: AngularFirestore) { }

  ngOnInit() {
    combineLatest([
      this._getRanks()
    ]).subscribe((data) => {
      this._load(data[0]);
    });
  }

  ngOnDestroy() {
    const modal = document.getElementById('modal-rank');
    if (modal) {
      modal.remove();
    }
  }

  _getRanks() {
    const options: QueryFn = ref => ref.orderBy('level', 'asc');
    this.ranksRef = this.afs.collection<Rank>(`ranks`, options);
    return this.ranksRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const uid = a.payload.doc.id;
        const data = a.payload.doc.data() as Rank;
        return {uid, ...data};
      }))
    );
  }

  _load(ranks) {
    this.ranks = [];
    for (const r of ranks) {
      const rank = new Rank(r.uid, r.label, r.level, r.points);
      this.ranks.push(rank);
    }
  }

  addRank() {
    this.rank = new Rank(null, {fr: ''}, null, null);
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
    } else {
      this.ranksRef.add(this.rank.export());
    }
  }

  deleteRank(rank: Rank) {
    UIkit.modal.confirm('Confirmer?').then(
      () => {
        this.afs.doc(`ranks/${rank.uid}`).delete();
      },
      () => {
        // do nothing
      }
    );
  }

}
