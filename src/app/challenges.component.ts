import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from './auth.service';
import { MyChallenge } from './models/my_challenge';
import { GameService } from './game.service';

@Component({
  selector: 'app-challenges',
  template: `
    <div *ngFor="let c of challenges">
      <div uk-grid>
        <div class="uk-width-1-2">{{c.challenge.label}}</div>
        <div class="uk-width-1-4">
          <a class="uk-badge" [class.active]="c.done" (click)="markAsDone(c, 0)">Terminé</a>
          <ng-container *ngIf="c.challenge.missions">
            <a *ngFor="let m of [1, 2, 3]" class="uk-badge" [class.active]="m === c.nbMissions" (click)="markAsDone(c, m)">
              {{m}}
            </a>
          </ng-container>
        </div>
        <div class="uk-width-1-4">
          {{c.getPts()}}pts
        </div>
      </div>
    </div>
    <button class="uk-button uk-align-center" (click)="save()" *ngIf="auth.user$ | async">Sauvegarder</button>
    `,
  styles: [`
    .active {
      background-color: #900;
      color: #fff;
    }
  `]
})
export class ChallengesComponent implements OnInit {

  @Input() challenges: MyChallenge[];

  constructor(public auth: AuthService, public game: GameService) { }

  ngOnInit() {
  }

  markAsDone(c: MyChallenge, nb: number) {
    if (c.done && nb === c.nbMissions) {
      c.done = false;
      c.nbMissions = 0;
    } else {
      c.done = true;
      c.nbMissions = nb;
    }
  }

  async save() {
    this.auth.user$.subscribe(user => {
      this.game.save(this.challenges, user.uid);
    });
  }

}
