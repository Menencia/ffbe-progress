import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-settings',
  template: `
    <h2>Options</h2>
    <div uk-grid *ngIf="user">
      <div>
        <label class="uk-form-label" for="displayName">Nom affiché : </label>
        <div class="uk-form-controls">
            <input class="uk-input"
              id="displayName"
              type="text"
              [(ngModel)]="user.displayName">
        </div>
      </div>
      <div>Tag: {{ user.tag }}</div>
    </div>
    <p><button class="uk-button uk-button-primary" (click)="saveSettings()">Valider</button></p>
  `,
  styles: []
})
export class SettingsComponent implements OnInit {

  user: User;

  constructor(
    public auth: AuthService,
  ) { }

  async ngOnInit() {
    // get current user
    this.user = await this.auth.user$.pipe(take(1)).toPromise();
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
