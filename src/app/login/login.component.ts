import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <h2 class="uk-heading-divider">Se connecter</h2>

    <div class="uk-grid-divider" uk-grid>
      <div class="uk-width-1-2@m">
        <div *ngIf="showSignup">
          <h3>Inscription</h3>
          <form class="uk-form-horizontal" #signup="ngForm">
            <div class="uk-margin">
              <div class="uk-form-label uk-text-bold">
                Email*
              </div>
              <div class="uk-form-controls">
                <input class="uk-input"
                  id="signupEmail"
                  name="signupEmail"
                  type="text"
                  [(ngModel)]="values.signup.email"
                  #signupEmail="ngModel"
                  required>
              </div>
            </div>

            <div class="uk-margin">
              <div class="uk-form-label uk-text-bold">
                Mot de passe*
              </div>
              <div class="uk-form-controls">
                <input class="uk-input"
                  id="signupPassword"
                  name="signupPassword"
                  type="password"
                  [(ngModel)]="values.signup.password"
                  #signupPassword="ngModel"
                  required>
              </div>
            </div>

            <div *ngIf="errors.signup" class="uk-alert uk-alert-danger">
              {{ errors.signup }}
            </div>

            <div *ngIf="successes.signup" class="uk-alert uk-alert-success">
              {{ successes.signup }}
            </div>

            <button class="uk-button uk-button-primary uk-align-right"
              [disabled]="!signup.form.valid"
              (click)="createAccount()">Valider</button>
            <button class="uk-button uk-button-link uk-align-right"
              (click)="showSigninForm()">Se connecter</button>
          </form>
        </div>

        <div *ngIf="showSignin">
          <h3>Connexion</h3>
          <form class="uk-form-horizontal" #signin="ngForm">
            <div class="uk-margin">
              <div class="uk-form-label uk-text-bold">
                Email*
              </div>
              <div class="uk-form-controls">
                <input class="uk-input"
                  id="signinEmail"
                  name="signinEmail"
                  type="text"
                  [(ngModel)]="values.signin.email"
                  #signinEmail="ngModel"
                  required>
              </div>
            </div>

            <div class="uk-margin">
              <div class="uk-form-label uk-text-bold">
                Mot de passe*
              </div>
              <div class="uk-form-controls">
                <input class="uk-input"
                  id="signinPassword"
                  name="signinPassword"
                  type="password"
                  [(ngModel)]="values.signin.password"
                  #signinPassword="ngModel"
                  required>
              </div>
            </div>

            <div *ngIf="errors.signin" class="uk-alert uk-alert-danger">
              {{ errors.signin }}
            </div>

            <button class="uk-button uk-button-primary uk-align-right"
              [disabled]="!signin.form.valid"
              (click)="loginWithPassword()">Valider</button>
            <button class="uk-button uk-button-link uk-align-right"
              (click)="showSignupForm()">S'inscrire</button>
          </form>
        </div>
      </div>

      <div class="uk-width-1-2@m">
        <h3>Connexion rapide</h3>
        <button class="uk-button uk-button-primary" (click)="loginWithGoogle()">
          <span class="uk-icon uk-margin-small-right" uk-icon="icon: google"></span>
          Se connecter via Google
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {

  values;
  errors;
  successes;

  showSignup: boolean;
  showSignin: boolean;

  constructor(
    public auth: AuthService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.showSigninForm();

    this.resetValues();
    this.resetErrors();
    this.resetSuccesses();
  }

  resetValues() {
    this.values = {
      signup: {
        email: '',
        password: '',
      },
      signin: {
        email: '',
        password: '',
      }
    };
  }

  resetErrors() {
    this.errors = {
      signup: null,
      signin: null,
    };
  }

  resetSuccesses() {
    this.successes = {
      signup: null,
    };
  }

  showSignupForm() {
    this.showSignup = true;
    this.showSignin = false;
  }

  showSigninForm() {
    this.showSignup = false;
    this.showSignin = true;
  }

  createAccount() {
    this.resetErrors();
    const {email, password} = this.values.signup;
    this.auth.createAccount(email, password)
      .then(() => {
        this.resetValues();
        this.successes.signup = 'Inscription réussie, vous pouvez vous connecter.';
      })
      .catch(error => {
        this.errors.signup = error.message;
      });
  }

  loginWithPassword() {
    this.resetErrors();
    const {email, password} = this.values.signin;
    this.auth.loginWithPassword(email, password)
      .then(() => {
        this.router.navigateByUrl('/home');
      })
      .catch(error => {
        this.errors.signin = error.message;
      });
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle()
      .then(() => {
        this.router.navigateByUrl('/home');
      });
  }

}
