import { Component, OnInit, Input } from '@angular/core';
import { Challenge } from './models/challenge';
import { AuthService } from './auth.service';
import { MyChallenge } from './models/my_challenge';

@Component({
  selector: 'app-challenges',
  template: `
    <div *ngFor="let c of challenges">
      {{c.challenge.label}}
      <input type="checkbox" [checked]="c.done">
      <input type="number" [value]="c.nbMissions"/>
    </div>
    <button (click)="save()" *ngIf="auth.user$ | async">Sauvegarder</button>
  `,
  styles: []
})
export class ChallengesComponent implements OnInit {

  @Input() challenges: MyChallenge[];

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

  save() {
    console.log('save()');
  }

}
