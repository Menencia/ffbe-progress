import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  template: `
    <app-admin-categories></app-admin-categories>
    <app-admin-challenges></app-admin-challenges>
    `,
  styles: []
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
