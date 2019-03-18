import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <app-login></app-login>
      <router-outlet></router-outlet>
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
