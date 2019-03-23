import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/firestore';
import { Category } from 'src/app/models/category';
import { map, } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import UIkit from 'uikit';

@Component({
  selector: 'app-admin-categories',
  template: `
    <div *ngFor="let category of categories">
      {{ category.name.fr }} / {{ category.position }}
    </div>
    <a uk-toggle="target: #modal-close-default">Ajouter une catégorie</a>

    <!-- This is the modal with the default close button -->
    <div id="modal-close-default" uk-modal>
      <div class="uk-modal-dialog uk-modal-body">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <h2 class="uk-modal-title">Ajouter une catégorie</h2>
          <p>
            <label for="name">Nom</label>
            <input type="text" [(ngModel)]="this.category.name.fr" />
          </p>
          <p>
            <label for="position">Position</label>
            <input type="number" [(ngModel)]="this.category.position" />
          </p>
          <p><button (click)="addCategory()">Valider</button></p>
      </div>
    </div>
  `,
  styles: []
})
export class AdminCategoriesComponent implements OnInit {

  public categories: Category[] = [];

  public category: Category = new Category({fr: ''}, 1);

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
    for (const category of categories) {
      this.categories.push(new Category(category.name, category.position));
      console.log(this.categories);
    }
  }

  addCategory() {
    UIkit.modal('#modal-close-default').hide();
    this.categoriesRef.add(this.category.export());
  }

  modifycategory() {

  }

  deleteCategory() {

  }

}
