import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  template: `
    <nav class="uk-navbar-container uk-margin" uk-navbar>

      <div class="uk-navbar-left">

        <a class="uk-navbar-item uk-logo" href="#">ffbe{{ '{' }}progress{{ '}' }}</a>

        <ul class="uk-navbar-nav">
          <li>
            <a href="#" routerLink="/home">
              <span class="uk-icon uk-margin-small-right" uk-icon="icon: home"></span>
              Accueil
            </a>
          </li>
          <li *ngIf="auth.user$ | async as user">
            <a href="#" [routerLink]="user.getProfileLink()">
              <span class="uk-icon uk-margin-small-right" uk-icon="icon: user"></span>
              Mon profil
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
              <a href="#">{{ user.tag }} <span uk-icon="icon:  triangle-down"></span></a>
              <div class="uk-navbar-dropdown">
                <ul class="uk-nav uk-navbar-dropdown-nav">
                  <li>
                    <a href="#" routerLink="/settings">
                      <span class="uk-icon uk-margin-small-right" uk-icon="icon: settings"></span>
                      Options
                    </a>
                  </li>
                  <li *ngIf="user.admin">
                    <a href="#" routerLink="/admin">
                      <span class="uk-icon uk-margin-small-right" uk-icon="icon: cog"></span>
                      Admin
                    </a>
                  </li>
                  <li>
                    <a href="#"(click)="logout()">
                      <span class="uk-icon uk-margin-small-right" uk-icon="icon: sign-out"></span>
                      Déconnexion
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
        <ng-template #showLogin>
          <a class="uk-button uk-button-primary" href="#" routerLink="/login">
            <span class="uk-icon uk-margin-small-right" uk-icon="icon: sign-in"></span>
            Se connecter
          </a>
        </ng-template>
      </div>

    </nav>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  logout() {
    this.auth.logout();
  }

}
