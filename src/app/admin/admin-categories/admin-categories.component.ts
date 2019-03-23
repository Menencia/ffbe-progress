import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { Category } from 'src/app/models/category';
import { map, } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import UIkit from 'uikit';

@Component({
  selector: 'app-admin-categories',
  template: `
    <div *ngFor="let c of categories">
      {{ c.name.fr }} / {{ c.position }} (
        <a (click)="modifyCategory(c)">modifier</a> |
        <a (click)="deleteCategory(c)">supprimer</a>
      )
    </div>
    <a (click)="addCategory()">Ajouter une catégorie</a>

    <!-- This is the modal with the default close button -->
    <div id="modal-close-default" uk-modal>
      <div class="uk-modal-dialog uk-modal-body" *ngIf="category">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <h2 class="uk-modal-title">{{ title }}</h2>
          <p>
            <label for="name">Nom</label>
            <input type="text" [(ngModel)]="category.name.fr" />
          </p>
          <p>
            <label for="position">Position</label>
            <input type="number" [(ngModel)]="category.position" />
          </p>
          <p><button (click)="_modifyCategory()">Valider</button></p>
      </div>
    </div>
  `,
  styles: []
})
export class AdminCategoriesComponent implements OnInit {

  public categories: Category[] = [];

  public title = 'test';
  public category: Category;

  public categoriesRef: AngularFirestoreCollection;

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
    this.categoriesRef = this.afs.collection<Category>(`categories`, options);
    return this.categoriesRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const uid = a.payload.doc.id;
        const data = a.payload.doc.data() as Category;
        return {uid, ...data};
      }))
    );
  }

  _load(categories) {
    this.categories = [];
    for (const c of categories) {
      const category = new Category(c.uid, c.name, c.position);
      this.categories.push(category);
    }
  }

  addCategory() {
    this.category = new Category(null, {fr: ''}, 1);
    UIkit.modal('#modal-close-default').show();
  }

  modifyCategory(category) {
    this.category = category;
    UIkit.modal('#modal-close-default').show();
  }

  _modifyCategory() {
    UIkit.modal('#modal-close-default').hide();
    if (this.category.uid) {
      this.afs.doc(`categories/${this.category.uid}`).update(this.category.export());
    } else {
      this.categoriesRef.add(this.category.export());
    }
  }

  deleteCategory(category: Category) {
    UIkit.modal.confirm('Confirmer?').then(
      () => {
        console.log(`delete: categories/${category.uid}`);
        this.afs.doc(`categories/${category.uid}`).delete();
      },
      () => {
        // do nothing
      }
    );
  }

}
