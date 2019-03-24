import { Component, OnInit } from '@angular/core';

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
  title = 'app';

  constructor() {

  }

  ngOnInit() {

  }
}
