import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { map, } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import UIkit from 'uikit';
import { Challenge } from 'src/app/models/challenge';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-admin-challenges',
  template: `
    <div class="uk-margin">
      <label for="category">Catégorie : </label>
      <div class="uk-inline">
        <select [(ngModel)]="category" (change)="changeCategory()" class="uk-select">
          <option *ngFor="let cat of categories" [ngValue]="cat">{{ cat.name.fr }}</option>
        </select>
      </div>
    </div>

    <div *ngIf="category">
      <table class="uk-table uk-table-divider">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Missions ?</th>
            <th>Points</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let ch of challenges">
            <td>{{ ch.label.fr }}</td>
            <td>{{ ch.missions }}</td>
            <td>{{ ch.points }}pts</td>
            <td>{{ ch.position }}</td>
            <td>
              <a uk-icon="pencil" (click)="modifyChallenge(ch)"></a>
              <a uk-icon="trash" (click)="deleteChallenge(ch)"></a>
            </td>
          </tr>
        </tbody>
      </table>

      <a class="uk-button uk-button-default" (click)="addChallenge()">Ajouter un défi</a>
    </div>

    <!-- MODAL challenge -->
    <div id="modal-challenge" uk-modal>
      <div class="uk-modal-dialog uk-modal-body" *ngIf="challenge">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <h2 class="uk-modal-title">{{ title }}</h2>
          <p>
            <label for="name">Catégorie</label>
            {{ category.name.fr }}
          </p>
          <p>
            <label for="name">Label</label>
            <input type="text" [(ngModel)]="challenge.label.fr" />
          </p>
          <p>
            <label for="missions">Missions</label>
            <input type="checkbox" [(ngModel)]="challenge.missions" />
          </p>
          <p>
            <label for="number">Points</label>
            <input type="number" [(ngModel)]="challenge.points" />
          </p>
          <p>
            <label for="position">Position</label>
            <input type="number" [(ngModel)]="challenge.position" />
          </p>
          <p><button (click)="_modifyChallenge()">Valider</button></p>
      </div>
    </div>
  `,
  styles: []
})
export class AdminChallengesComponent implements OnInit, OnDestroy {

  public categories: Category[];
  public category: Category;

  public challenges: Challenge[] = [];

  // Modal
  public title = 'Ch';
  public challenge: Challenge;


  constructor(public afs: AngularFirestore) { }

  ngOnInit() {
    combineLatest([
      this._getCategories()
    ]).subscribe((data) => {
      this._load(data[0]);
    });
  }

  ngOnDestroy() {
    document.getElementById('modal-challenge').remove();
  }

  _getCategories() {
    const options: QueryFn = ref => ref.orderBy('position', 'asc');
    return this.afs
      .collection<Category>(`categories`, options)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const uid = a.payload.doc.id;
          const data = a.payload.doc.data() as Category;
          return {uid, ...data};
        }))
      );
  }

  _load(categories) {
    this.categories = [];
    for (const cat of categories) {
      const category = new Category(cat.uid, cat.name, cat.position);
      this.categories.push(category);
    }
  }

  changeCategory() {
    combineLatest([
      this._getChallenges()
    ]).subscribe((data) => {
      this.challenges = [];
      for (const ch of data[0]) {
        const challenge = new Challenge(ch.uid, ch.label, ch.missions, ch.points, ch.position, this.category);
        this.challenges.push(challenge);
      }
    });
  }

  _getChallenges() {
    const options = ref => ref
      .where('category', '==', this.category.uid)
      .orderBy('position', 'asc');
    return this.afs
      .collection(`challenges`, options)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const uid = a.payload.doc.id;
          const data = a.payload.doc.data() as Challenge;
          return {uid, ...data};
        }))
      );
  }

  addChallenge() {
    this.challenge = new Challenge(null, {fr: ''}, false, 0, 1, this.category);
    UIkit.modal('#modal-challenge').show();
  }

  modifyChallenge(ch) {
    this.challenge = ch;
    UIkit.modal('#modal-challenge').show();
  }

  _modifyChallenge() {
    UIkit.modal('#modal-challenge').hide();
    if (this.challenge.uid) {
      this.afs.doc(`challenges/${this.challenge.uid}`).update(this.challenge.export());
    } else {
      this.afs.collection('challenges').add(this.challenge.export());
    }
  }

  deleteChallenge(ch) {
    UIkit.modal.confirm('Confirmer?').then(
      () => {
        this.afs.doc(`challenges/${ch.uid}`).delete();
      },
      () => {
        // do nothing
      }
    );
  }

}
