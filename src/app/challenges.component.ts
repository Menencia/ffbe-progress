import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { MyChallenge } from './models/my_challenge';
import { GameService } from './game.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Challenge } from './models/challenge';
import { map, flatMap } from 'rxjs/operators';
import { Observable, combineLatest, of  } from 'rxjs';

@Component({
  selector: 'app-challenges',
  template: `
    <div *ngFor="let c of mychallenges">
      <div uk-grid>
        <div class="uk-width-1-2">{{c.challenge.label.fr}}</div>
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

  challenges: Observable<Challenge[]>;

  mychallenges: MyChallenge[] = [];

  constructor(
    public auth: AuthService,
    public game: GameService,
    public afs: AngularFirestore,
  ) { }

  ngOnInit() {
    combineLatest([
      this.getChallenges(),
      this.getMyChallenges()
    ]).subscribe(data => {
      this._load(data[0], data[1]);
    });
  }

  getChallenges() {
    const challengesRef = this.afs.collection<Challenge>('challenges');
    return challengesRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const uid = a.payload.doc.id;
        const data = a.payload.doc.data() as Challenge;
        return {uid, ...data};
      }))
    );
  }

  getMyChallenges() {
    return this.auth.user$.pipe(
      flatMap(user => this._getMyChallenges(user))
    );
  }

  _getMyChallenges(user) {
    if (!user) {
      return of([]);
    }
    const mychallengesRef = this.afs.doc(`users/${user.uid}`).collection('mychallenges');
    return mychallengesRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        return {...data};
      }))
    );
  }

  _load(challenges, data) {
    this.mychallenges = [];
    for (const challenge of challenges) {
      let done, nbMissions;
      const mychallenge = data.find(c => c.challenge === challenge.uid);
      if (mychallenge) {
        done = true;
        nbMissions = mychallenge.nbMissions;
      } else {
        done = false;
        nbMissions = 0;
      }
      this.mychallenges.push(new MyChallenge(challenge, done, nbMissions));
    }
  }

  markAsDone(c: MyChallenge, nb: number) {
    if (c.done && nb === c.nbMissions) {
      c.done = false;
      c.nbMissions = 0;
    } else {
      c.done = true;
      c.nbMissions = nb;
    }
    c.changed = true;
    // TODO: save old value to identify it new value is different from old value
  }

  async save() {
    this.auth.user$.subscribe(user => {
      this.game.save(this.mychallenges, user.uid);
    });
  }

}
