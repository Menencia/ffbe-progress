import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  template: `
    <h2 class="uk-heading-divider">Admin</h2>

    <ul uk-tab>
      <li class="uk-active"><a href="#">Catégories</a></li>
      <li><a href="#">Défis</a></li>
      <li><a href="#">Rangs</a></li>
    </ul>

    <ul class="uk-switcher uk-margin">
      <li><app-admin-categories></app-admin-categories></li>
      <li><app-admin-challenges></app-admin-challenges></li>
      <li><app-admin-ranks></app-admin-ranks></li>
    </ul>
    `,
  styles: []
})
export class AdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
