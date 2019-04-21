import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <app-login></app-login>
      <div class="uk-container">
        <router-outlet></router-outlet>
      </div>
    </div>

    <footer>
      <div class="uk-container uk-margin-top">
        <div class="uk-grid uk-margin-top uk-margin-bottom uk-text-small">
          <ul class="uk-list uk-width-1-3@m">
            <li>
              Made with 💗 by <a href="https://menencia.com" target="_blank">Menencia</a>
            </li>
          </ul>
          <ul class="uk-list uk-width-1-3@m">
            <li class="uk-nav-header">Github</li>
            <li>
              <a [href]="githubReleases" target="_blank">Releases</a>
            </li>
            <li>
              <a [href]="githubCommits" target="_blank">Commits</a>
            </li>
            <li>
              <a [href]="githubIssues" target="_blank">Issues</a>
            </li>
          </ul>
          <ul class="uk-list uk-width-1-3@m">
            <li class="uk-nav-header">Divers</li>
            <li>
              <a href="#" routerLink="/changes">Derniers changements</a>
            </li>
            <li>
              <a href="#" routerLink="/about">À propos</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      margin-top: 100px;
      background-color: #f8f8f8;
    }
    footer a {
      color: #aaa;
    }
  `]
})
export class AppComponent implements OnInit {

  githubReleases = 'https://github.com/Menencia/ffbe-progress/releases';
  githubCommits = 'https://github.com/Menencia/ffbe-progress/commits/master';
  githubIssues = 'https://github.com/Menencia/ffbe-progress/issues';

  constructor(
    public translate: TranslateService,
  ) {

  }

  async ngOnInit() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('fr');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('fr');
  }

}
