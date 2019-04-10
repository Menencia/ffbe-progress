import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import UIkit from 'uikit';

import { Change, ChangeType, ChangeOperation } from 'src/app/models/change';
import { Category } from 'src/app/models/category';

import { DataService } from 'src/app/services/data.service';
import { ChangeService } from 'src/app/services/change.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-categories',
  template: `
    <table class="uk-table uk-table-divider">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Position</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let cat of categories">
          <td>{{ cat.name.fr }}</td>
          <td>{{ cat.position }}</td>
          <td>
            <a uk-icon="pencil" (click)="modifyCategory(cat)"></a>
            <a uk-icon="trash" (click)="deleteCategory(cat)"></a>
          </td>
        </tr>
      </tbody>
    </table>

    <a class="uk-button uk-button-default" (click)="addCategory()">Ajouter une catégorie</a>

    <!-- MODAL category -->
    <div id="modal-category" uk-modal>
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
export class AdminCategoriesComponent implements OnInit, OnDestroy {

  public categories: Category[] = [];

  public title = 'Cat';
  public category: Category;

  constructor(
    public data: DataService,
    public afs: AngularFirestore,
    public auth: AuthService,
    public changeService: ChangeService,
  ) { }

  ngOnInit() {
    this.data.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  ngOnDestroy() {
    const modal = document.getElementById('modal-category');
    if (modal) {
      modal.remove();
    }
  }

  addCategory() {
    this.category = new Category({});
    UIkit.modal('#modal-category').show();
  }

  modifyCategory(category) {
    this.category = category;
    UIkit.modal('#modal-category').show();
  }

  async _modifyCategory() {
    UIkit.modal('#modal-category').hide();
    if (this.category.uid) {
      this.afs.doc(`categories/${this.category.uid}`).update(this.category.export());
    } else {
      // this.afs.collection('categories').add(this.category.export());

      // create new change
      const user = await this.auth.getUser();
      const change = new Change({
        name: this.category.name.fr,
        type: ChangeType.Category,
        operation: ChangeOperation.Creation,
        author: user.uid,
        date: new Date(),
      });
      this.changeService.add(change);
    }
  }

  deleteCategory(category: Category) {
    // TODO check if the category is empty
    UIkit.modal.confirm('Confirmer?').then(
      () => {
        this.afs.doc(`categories/${category.uid}`).delete();
      },
      () => {
        // do nothing
      }
    );
  }

}
