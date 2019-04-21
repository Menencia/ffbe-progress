import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <h2 class="uk-heading-divider">À propos</h2>

    <ul class="uk-list uk-list-bullet">
      <li>Développeur : Menencia</li>
      <li>Admin : Breizh</li>
      <li>Framework JS : Angular</li>
      <li>Framework CSS : Uikit</li>
    </ul>
  `,
  styles: []
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
