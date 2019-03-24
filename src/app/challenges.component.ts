import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { MyChallenge } from './models/my_challenge';
import { GameService } from './game.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Challenge } from './models/challenge';
import { map, flatMap } from 'rxjs/operators';
import { Observable, combineLatest, of  } from 'rxjs';
import { Category } from './models/category';
import { MyCategory } from './models/my_category';

@Component({
  selector: 'app-challenges',
  template: `
    <div *ngFor="let mycat of mycategories">
      <strong>{{ mycat.category.name.fr }}</strong>
      <div *ngFor="let mych of mycat.mychallenges">
        <div uk-grid>
          <div class="uk-width-1-2">{{ mych.challenge.label.fr }}</div>
          <div class="uk-width-1-4">
            <a class="uk-badge" [class.active]="mych.done" (click)="markAsDone(mych, 0)">Terminé</a>
            <ng-container *ngIf="mych.challenge.missions">
              <a *ngFor="let m of [1, 2, 3]" class="uk-badge" [class.active]="m === mych.nbMissions" (click)="markAsDone(mych, m)">
                {{m}}
              </a>
            </ng-container>
          </div>
          <div class="uk-width-1-4">
            {{ mych.getPts() }}pts
          </div>
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

  mycategories: MyCategory[] = [];

  constructor(
    public auth: AuthService,
    public game: GameService,
    public afs: AngularFirestore,
  ) { }

  ngOnInit() {
    combineLatest([
      this.getChallenges(),
      this.getCategories(),
      this.getMyChallenges()
    ]).subscribe(data => {
      const [challenges, categories, mychallenges] = data;
      this._load(challenges, categories, mychallenges);
    });
  }

  getChallenges() {
    return this.afs
    .collection<Challenge>('challenges')
    .snapshotChanges()
    .pipe(
      map(actions => actions.map(a => {
        const uid = a.payload.doc.id;
        const data = a.payload.doc.data() as Challenge;
        return {uid, ...data};
      }))
    );
  }

  getCategories() {
    return this.afs
      .collection<Challenge>('categories')
      .snapshotChanges()
      .pipe(
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

  _load(challenges, categories, mychallenges) {
    let done, nbMissions;
    this.mycategories = [];
    for (const cat of categories) {
      const category = new Category(cat.uid, cat.name, cat.position);
      const mycategory = new MyCategory(category);
      for (const ch of challenges) {
        if (ch.category !== cat.uid) {
          continue;
        }
        const challenge = new Challenge(ch.uid, ch.label, ch.missions, ch.points, ch.position, cat);
        const mychallenge = mychallenges.find(c => c.challenge === challenge.uid);
        if (mychallenge) {
          done = true;
          nbMissions = mychallenge.nbMissions;
        } else {
          done = false;
          nbMissions = 0;
        }
        const mych = new MyChallenge(challenge, done, nbMissions);
        mycategory.mychallenges.push(mych);
      }
      this.mycategories.push(mycategory);
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
      this.game.save(this.mycategories, user.uid);
    });
  }

}
