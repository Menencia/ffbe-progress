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
              <strong><a [href]="githubReleases" target="_blank">v1.0</a></strong>
            </li>
          </ul>
          <ul class="uk-list uk-width-1-3@m">
            <li>
              <a [href]="githubCommits" target="_blank">Github commits</a>
            </li>
            <li>
              <a [href]="githubIssues" target="_blank">Github issues</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      background-color: #f8f8f8;
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
