import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  template: `
    <nav class="uk-navbar-container uk-margin" uk-navbar>

      <div class="uk-navbar-left">

        <a class="uk-navbar-item uk-logo" href="#">ffbe{{ '{' }}progress{{ '}' }}</a>

        <ul class="uk-navbar-nav">
          <li>
            <a href="#" routerLink="/mychallenges">
              <span class="uk-icon uk-margin-small-right" uk-icon="icon: star"></span>
              Défis
            </a>
          </li>
          <li>
            <a href="#" routerLink="/ranking">
              <span class="uk-icon uk-margin-small-right" uk-icon="icon: users"></span>
              Classement
            </a>
          </li>
        </ul>

      </div>

      <div class="uk-navbar-right">
        <div *ngIf="auth.user$ | async as user; else showLogin">
          <ul class="uk-navbar-nav">
            <li class="uk-navbar-item">
              {{ user.getName() }}
            </li>
            <li *ngIf="user.admin">
              <a href="#" routerLink="/admin">
                <span class="uk-icon uk-margin-small-right" uk-icon="icon: cog"></span>
                Admin
              </a>
            </li>
            <li *ngIf="user.admin">
              <a href="#"(click)="logout()">
                <span class="uk-icon uk-margin-small-right" uk-icon="icon: sign-out"></span>
                Déconnexion
              </a>
            </li>
          </ul>
        </div>
        <ng-template #showLogin>
          <a class="uk-button uk-button-primary" href="javascript:void(0)" (click)="login()">
            <span class="uk-icon uk-margin-small-right" uk-icon="icon: sign-in"></span>
            Se connecter avec Google
          </a>
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
