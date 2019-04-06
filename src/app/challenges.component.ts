import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { MyChallenge } from './models/my_challenge';
import { GameService } from './game.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Challenge } from './models/challenge';
import { map, flatMap, take } from 'rxjs/operators';
import { combineLatest, of  } from 'rxjs';
import { Category } from './models/category';
import { MyCategory } from './models/my_category';
import { Rank } from './models/rank';
import { DataService } from './data.service';

@Component({
  selector: 'app-challenges',
  template: `
    <div uk-grid>
      <div class="uk-width-auto@m">
          <ul class="uk-tab-left" uk-tab="connect: #component-tab-left; animation: uk-animation-fade">
            <li *ngFor="let mycat of mycategories"><a href="#">{{ mycat.category.name.fr }}</a></li>
          </ul>

          <div class="uk-text-center uk-text-bold uk-heading-line">
            <span class="uk-badge">{{ totalPoints }}pts</span>
          </div>

          <div class="uk-text-center uk-text-bold">
            <span class="" *ngIf="rank">Nv{{ rank.level }}. {{ rank.label.fr }}</span>
          </div>

          <button class="uk-button uk-align-center"
            (click)="save()"
            [class.uk-button-primary]="isSavePrimary"
            *ngIf="auth.user$ | async">
            <span uk-icon="icon: upload" *ngIf="!isSaveLoading"></span>
            <span uk-spinner="ratio: 0.5" *ngIf="isSaveLoading"></span>
            Sauvegarder</button>
      </div>
      <div class="uk-width-expand@m">
          <ul id="component-tab-left" class="uk-switcher">
              <li *ngFor="let mycat of mycategories">
                <table class="uk-table uk-table-divider">
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Terminé ?</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let mych of mycat.mychallenges">
                      <td>{{ mych.challenge.label.fr }}</td>
                      <td>
                        <a class="uk-badge done-inactive" [class.done-active]="mych.done" (click)="markAsDone(mych, 0)">Terminé</a>
                        <ng-container *ngIf="mych.challenge.missions">
                          <a *ngFor="let m of [1, 2, 3]"
                            class="star-inactive"
                            uk-icon="star"
                            [class.star-active]="m <= mych.nbMissions"
                            (click)="markAsDone(mych, m)">
                          </a>
                        </ng-container>
                      </td>
                      <td>{{ mych.getPts() }}pts</td>
                    </tr>
                  </tbody>
                </table>
              </li>
          </ul>
      </div>
    </div>
    `,
  styles: [`
    .done-inactive {
      background-color: #ddd;
      color: white;
    }
    .done-inactive:hover {
      color: #009;
    }
    .done-active {
      background-color: white;
      color: #009;
    }
    .star-inactive {
      color: #ddd;
    }
    .star-inactive:hover {
      color: #009;
    }
    .star-active {
      color: #009;
    }
  `]
})
export class ChallengesComponent implements OnInit {

  mycategories: MyCategory[] = [];
  ranks: Rank[] = [];
  mychallenges;

  isSavePrimary = false;
  isSaveLoading = false;

  totalPoints: number;
  rank: Rank;

  constructor(
    public auth: AuthService,
    public game: GameService,
    public data: DataService,
    public afs: AngularFirestore,
  ) { }

  ngOnInit() {
    this.data.getRanks()
      .subscribe(ranks => this.ranks = ranks);
    this.auth.user$
      .pipe(
        flatMap(user => this.data.getMyCategories(user))
      ).subscribe(mycategories => {
        this.mycategories = mycategories;

        // initial challenges
        this.mychallenges = this.buildMyChallenges();

        // refresh total points & rank
        this.countTotalPoints();
        this.refreshRank();
      });
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
    this.checkChanges();
    this.countTotalPoints();
    this.refreshRank();
  }

  /**
   * {challenge, nbMissions}
   */
  checkChanges() {
    const toSet = [];
    const toDelete = [];
    const A = this.mychallenges;
    const B = this.buildMyChallenges();

    for (const e of B) {
      const found = A.find(f => f.challenge === e.challenge);
      if (!found || found.nbMissions !== e.nbMissions) {
        toSet.push(e);
      }
    }

    for (const e of A) {
      const found = B.find(f => f.challenge === e.challenge);
      if (!found) {
        toDelete.push(e);
      }
    }

    this.isSavePrimary = toSet.length !== 0 || toDelete.length !== 0;
    return [toSet, toDelete];
  }

  buildMyChallenges() {
    const res = [];
    for (const mycategory of this.mycategories) {
      for (const mychallenge of mycategory.mychallenges) {
        if (mychallenge.done) {
          res.push(mychallenge.export());
        }
      }
    }
    return res;
  }

  countTotalPoints() {
    let pts = 0;

    for (const mycat of this.mycategories) {
      for (const mych of mycat.mychallenges) {
        pts += mych.getPts();
      }
    }

    this.totalPoints = pts;
  }

  refreshRank() {
    let rank = null;
    let i = 0;
    while(this.totalPoints >= this.ranks[i].points) {
      i += 1;
      rank = this.ranks[i];
    }
    this.rank = rank;
  }

  async save() {
    const [toSet, toDelete] = this.checkChanges();
    this.isSaveLoading = true;
    const user = await this.auth.user$.pipe(take(1)).toPromise();
    this.game.save(toSet, toDelete, user, this.totalPoints, () => {
      this.isSavePrimary = false;
      this.isSaveLoading = false;
    });
  }

}
