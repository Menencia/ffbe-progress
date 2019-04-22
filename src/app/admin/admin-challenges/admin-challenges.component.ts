import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import UIkit from 'uikit';

import { Challenge } from 'src/app/models/challenge';
import { Category } from 'src/app/models/category';

import { DataService } from 'src/app/services/data.service';
import { ChangeService } from 'src/app/services/change.service';

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
        <h4 class="uk-modal-title">{{ title }}</h4>
        <form class="uk-form-horizontal" #challenges="ngForm">

          <div class="uk-margin">
            <div class="uk-form-label uk-text-bold" style="margin-top: 0;">
              Catégorie
            </div>
            <div class="uk-form-controls">
              {{ category.name.fr }}
            </div>
          </div>

          <div class="uk-margin">
            <div class="uk-form-label uk-text-bold">
              Label*
            </div>
            <div class="uk-form-controls">
              <input class="uk-input"
                id="chName"
                name="chName"
                type="text"
                [(ngModel)]="challenge.label.fr"
                #chName="ngModel"
                required>
            </div>
          </div>

          <div class="uk-margin">
            <div class="uk-form-label uk-text-bold" style="margin-top: 0;">
              Missions
            </div>
            <div class="uk-form-controls">
              <input class="uk-checkbox"
                id="chMissions"
                name="chMissions"
                type="checkbox"
                [(ngModel)]="challenge.missions"
                #chMissions="ngModel">
            </div>
          </div>

          <div class="uk-margin">
            <div class="uk-form-label uk-text-bold">
              Points
            </div>
            <div class="uk-form-controls">
              <input class="uk-input"
                id="chPoints"
                name="chPoints"
                type="number"
                [(ngModel)]="challenge.points"
                #chPoints="ngModel">
            </div>
          </div>

          <div class="uk-margin">
            <div class="uk-form-label uk-text-bold">
              Position
            </div>
            <div class="uk-form-controls">
              <input class="uk-input"
                id="chPosition"
                name="chPosition"
                type="number"
                [(ngModel)]="challenge.position"
                #chPosition="ngModel">
            </div>
          </div>

          <button class="uk-button uk-button-primary uk-align-right"
            [disabled]="!challenges.form.valid"
            (click)="_modifyChallenge()">Valider</button>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class AdminChallengesComponent implements OnInit, OnDestroy {

  public categories: Category[];
  public category: Category;
  public original;

  public challenges: Challenge[] = [];

  // Modal
  public title = 'Éditer un défi';
  public challenge: Challenge;

  constructor(
    public data: DataService,
    public afs: AngularFirestore,
    public changeService: ChangeService,
  ) { }

  ngOnInit() {
    this.data.getCategories()
      .subscribe(categories => this.categories = categories);
  }

  ngOnDestroy() {
    const modal = document.getElementById('modal-challenge');
    if (modal) {
      modal.remove();
    }
  }

  changeCategory() {
    this.challenges = this.category.challenges;
  }

  addChallenge() {
    this.challenge = new Challenge({category: this.category});
    UIkit.modal('#modal-challenge').show();
  }

  modifyChallenge(ch) {
    this.challenge = ch;
    this.original = Object.assign({}, ch.export());
    UIkit.modal('#modal-challenge').show();
  }

  _modifyChallenge() {
    UIkit.modal('#modal-challenge').hide();
    if (this.challenge.uid) {
      this.afs.doc(`categories/${this.category.uid}/challenges/${this.challenge.uid}`)
        .update(this.challenge.export());

      // new change
      this.changeService.challengeUpdate(
        `${this.challenge.label.fr} (${this.category.name.fr})`,
        (this.original.points !== this.challenge.points ||
          this.original.missions !== this.challenge.missions)
      );
    } else {
      this.afs.collection(`categories/${this.category.uid}/challenges`).add(this.challenge.export());

      // new change
      this.changeService.challengeCreate(
        `${this.challenge.label.fr} (${this.category.name.fr})`,
        false
      );
    }

    this.refreshChallenges();
  }

  deleteChallenge(ch) {
    UIkit.modal.confirm('Confirmer?').then(
      () => {
        this.afs.doc(`categories/${this.category.uid}/challenges/${ch.uid}`).delete();

        // new change
        this.changeService.challengeDelete(
          `${ch.label.fr} (${this.category.name.fr})`,
          true
        );

        this.refreshChallenges();
      },
      () => {
        // do nothing
      }
    );
  }

  refreshChallenges() {
    this.data.getChallenges(this.category.uid)
      .subscribe(challenges => this.challenges = challenges);
  }

}
