import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <nav class="uk-navbar-container uk-margin" uk-navbar>
      <div class="uk-navbar-left">
        <a class="uk-navbar-item uk-logo" href="#">FFBE progress</a>
        <div class="uk-navbar-item">
          <a href="#" routerLink="/challenges">Challenges</a>
        </div>
      </div>
      <div class="uk-navbar-right">
        <div *ngIf="auth.user$ | async as user; else showLogin">
          {{ user.name }}
          <span *ngIf="user.admin">- <a href="#" routerLink="/admin">Admin</a></span>
          - <a href="#" (click)="logout()">Déconnexion</a>
        </div>
        <ng-template #showLogin>
          <a href="#" (click)="login()">Se connecter avec Google</a>
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
