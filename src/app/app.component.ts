import { Component, AfterContentChecked, ChangeDetectionStrategy, DoCheck, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <app-login></app-login>
      <div class="uk-container">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public translate: TranslateService,
    public router: Router,
  ) {

  }

  async ngOnInit() {
    // this language will be used as a fallback when a translation isn't found in the current language
    this.translate.setDefaultLang('fr');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    this.translate.use('fr');

    // get current user
    const user = await this.auth.user$.pipe(take(1)).toPromise();

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        // check if displayName is set
        if (user && !user.displayName && ev.url !== '/settings') {
          this.router.navigateByUrl('/settings');
        }
      }
    });
  }

}
