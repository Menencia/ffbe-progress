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
          <p>Merci de vous êtes connecté au site.<br />Pour commencer, veuillez définir votre pseudo.</p>
          <form class="uk-form-horizontal uk-margin-large">
            <div class="uk-margin">
                <label class="uk-form-label" for="form-horizontal-text">Nom affiché : </label>
                <div class="uk-form-controls">
                    <input
                      class="uk-input"
                      id="form-horizontal-text"
                      type="text"
                      placeholder="Pseudo..."
                      [(ngModel)]="user.displayName"
                      [ngModelOptions]="{standalone: true}">
                </div>
            </div>
          </form>
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

    // check if displayname exist
    if (!this.user.displayName) {
      UIkit.modal('#modal-displayName').show();
    }
  }

  saveDisplayName() {
    if (this.user.displayName) {
      UIkit.modal('#modal-displayName').hide();
      this.auth.saveDisplayName(this.user.displayName);
    }
  }
}
