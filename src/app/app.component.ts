import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { AuthService } from './auth.service';
import { take } from 'rxjs/operators';
import UIkit from 'uikit';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <app-login></app-login>
      <div class="uk-container">
        <router-outlet></router-outlet>
      </div>
    </div>

    <!-- MODAL category -->
    <div id="modal-displayName" uk-modal>
      <div class="uk-modal-dialog uk-modal-body" *ngIf="user">
          <button class="uk-modal-close-default" type="button" uk-close></button>
          <h2 class="uk-modal-title">Bienvenue</h2>
          <div uk-grid>
            <div>
              <label class="uk-form-label" for="displayName">Nom affiché : </label>
              <div class="uk-form-controls">
                  <input class="uk-input"
                    id="displayName"
                    type="text"
                    [(ngModel)]="user.displayName">
              </div>
            </div>
            <div>
              <label class="uk-form-label" for="url">Url personnalisé : </label>
              <div class="uk-form-controls">
                  <input class="uk-input"
                    id="url"
                    type="text"
                    [(ngModel)]="user.customUrl">
              </div>
            </div>
          </div>
          <p><button class="uk-button uk-button-primary" (click)="saveDisplayName()">Valider</button></p>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'app';

  user;

  constructor(
    public auth: AuthService,
    public translate: TranslateService
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('fr');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('fr');
  }

  async ngOnInit() {
    this.user = await this.auth.user$.pipe(take(1)).toPromise();

    // check if displayName and customUrl exist
    if (!this.user.displayName || !this.user.customUrl) {
      UIkit.modal('#modal-displayName').show();
    }
  }

  saveDisplayName() {
    if (this.user.displayName) {
      UIkit.modal('#modal-displayName').hide();
      const {displayName, customUrl} = this.user;
      this.auth.saveUser({displayName, customUrl});
    }
  }
}
