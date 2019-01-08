import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <nav class="uk-navbar-container uk-margin" uk-navbar>
      <div class="uk-navbar-left">
        <a class="uk-navbar-item uk-logo">FFBE progress</a>
      </div>
      <div class="uk-navbar-right">
        <div *ngIf="auth.user$ | async as user; else showLogin">
          {{ user.name }}
          <button class="uk-button" (click)="logout()">Logout</button>
        </div>
        <ng-template #showLogin>
          <button class="uk-button" (click)="login()">Login with Google</button>
        </ng-template>
      </div>
    </nav>
  `,
  styles: []
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.auth.login();
  }
  logout() {
    this.auth.logout();
  }

}
