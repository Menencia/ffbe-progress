import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { map, } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import UIkit from 'uikit';
import { Challenge } from 'src/app/models/challenge';
import { Category } from 'src/app/models/category';

@Component({
  selector: 'app-admin-challenges',
  template: `
    <p><select [(ngModel)]="category" (change)="changeCategory()">
      <option value="">Choisir une catégorie</option>
      <option *ngFor="let cat of categories" [ngValue]="cat">{{ cat.name.fr }}</option>
    </select></p>
    <div *ngIf="category">
      <div *ngFor="let ch of challenges">
        {{ ch.label.fr }} / {{ ch.position }} (
          <a (click)="modifyChallenge(ch)">modifier</a> |
          <a (click)="deleteChallenge(ch)">supprimer</a>
        )
      </div>
      <a (click)="addChallenge()">Ajouter un challenge</a>
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
export class AdminChallengesComponent implements OnInit {

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
    const options = ref => ref.where('category', '==', this.category.uid);
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
