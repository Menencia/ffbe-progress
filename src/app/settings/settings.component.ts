import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';

@Component({
  selector: 'app-settings',
  template: `
    <h2 class="uk-heading-divider">Options</h2>

    <form class="uk-form-horizontal" *ngIf="user" #settings="ngForm">

      <div class="uk-margin">
        <label class="uk-form-label uk-text-bold" for="displayName">
          <span uk-icon="user"></span>
          <span class="uk-text-middle">Nom affiché*</span>
        </label>
        <div class="uk-form-controls">
          <input class="uk-input"
            id="displayName"
            name="displayName"
            type="text"
            [(ngModel)]="user.displayName"
            pattern="[a-zA-Z0-9]*"
            #displayName="ngModel"
            required>
          <div [hidden]="displayName.valid || displayName.pristine" class="uk-alert uk-alert-danger">
            Champ obligatoire : ne peut contenir que des lettres ou des chiffres.
          </div>
        </div>
      </div>

      <div class="uk-margin">
        <label class="uk-form-label uk-text-bold" style="margin-top: 0;">
          <span uk-icon="hashtag"></span>
          <span class="uk-text-middle">Tag</span>
        </label>
        <div class="uk-form-controls">
          <span *ngIf="user.tag else noTag">{{ user.tag }}</span>
          <ng-template #noTag>
            <i>N/A</i>
          </ng-template>
        </div>
      </div>

      <div class="uk-margin">
        <div class="uk-form-label uk-text-bold" style="margin-top: 0;">
          <span uk-icon="mail"></span>
          <span class="uk-text-middle"> Email</span>
        </div>
        <div class="uk-form-controls">
          {{ user.email }}
        </div>
      </div>

      <button class="uk-button uk-button-primary uk-align-right"
        [disabled]="!settings.form.valid || settings.form.pristine"
        (click)="saveSettings()">Valider</button>

    </form>
  `,
  styles: [`
    .ng-valid[required], .ng-valid.required  {
      border-left: 5px solid #42A948; /* green */
    }

    .ng-invalid:not(form)  {
      border-left: 5px solid #a94442; /* red */
    }
  `]
})
export class SettingsComponent implements OnInit {

  user: User;

  constructor(
    public auth: AuthService,
  ) { }

  async ngOnInit() {
    // get current user
    this.user = await this.auth.getUser();
  }

  saveSettings() {
    if (this.user.displayName && /^[a-zA-Z0-9]+$/.test(this.user.displayName)) {

      // build 4-digit number
      let number = Math.floor(Math.random() * 10000).toString();
      while (number.length < 4) {
        number = '0' + number;
      }

      this.user.tag = this.user.displayName + '#' + number;
      const {displayName, tag} = this.user;
      this.auth.saveUser({displayName, tag});
    }
  }

}
