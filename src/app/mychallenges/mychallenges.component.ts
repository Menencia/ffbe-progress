import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { flatMap } from 'rxjs/operators';

import { Rank } from '../models/rank';
import { MyCategory } from '../models/my_category';
import { User } from '../models/user';
import { Category } from '../models/category';
import { Challenge } from '../models/challenge';

import { GameService } from '../services/game.service';
import { DataService } from '../services/data.service';
import { MyChallenge } from '../models/my_challenge';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mychallenges',
  template: `
  <h2 *ngIf="user" class="uk-heading-divider">
    Profil de {{ user.displayName }}
    <button class="uk-button uk-button-link"
      (click)="toggleEditMode()"
      *ngIf="(auth.user$ | async) && isMyProfile()">
      <span uk-icon="pencil"></span>
      <span class="editModeLabel" *ngIf="!editMode">modifier</span>
      <span class="editModeLabel" *ngIf="editMode">annuler la modification</span>
    </button>
  </h2>

  <div *ngIf="!mycategory">
    <div uk-grid>
      <div class="uk-width-2-3@m">
        <circle-progress
          class="pointer"
          *ngFor="let mycat of mycategories"
          (click)="displayCategory(mycat)"
          [percent]="mycat.progress()"
          [radius]="50"
          [outerStrokeWidth]="8"
          [innerStrokeWidth]="4"
          [outerStrokeColor]="'#ddd'"
          [innerStrokeColor]="'#eee'"
          [animation]="false"
          [subtitle]="mycat.category.name.fr"
          [subtitleColor]="'#444'"
        ></circle-progress>
      </div>
      <div class="uk-width-1-3@m">

        <div class="uk-text-center uk-text-bold uk-heading-line">
          <span class="uk-badge">{{ totalPoints }}pts</span>
        </div>

        <div class="uk-text-center uk-text-bold">
          <span class="" *ngIf="rank">{{ rank }}</span>
        </div>
      </div>
    </div>
  </div>

  <div *ngIf="mycategory">

    <div uk-grid class="uk-flex uk-flex-middle category-header">
      <div (click)="displayCategory(null)" class="pointer">
        <span uk-icon="arrow-left"></span>
      </div>
      <div>
        <circle-progress
          [percent]="mycategory.progress()"
          [radius]="25"
          [outerStrokeWidth]="4"
          [innerStrokeWidth]="2"
          [outerStrokeColor]="'#ddd'"
          [innerStrokeColor]="'#eee'"
          [animation]="false"
          [showSubtitle]="false"
          [titleFontSize]="15"
        ></circle-progress>
      </div>
      <div class="uk-flex-auto">
        {{ mycategory.category.name.fr }}
      </div>
      <div>
        <div class="uk-text-center uk-text-bold uk-heading-line">
          <span class="uk-badge">{{ totalPoints }}pts</span>
        </div>

        <div class="uk-text-center uk-text-bold">
          <span class="" *ngIf="rank">{{ rank }}</span>
        </div>

        <button class="uk-button uk-align-center"
          (click)="save()"
          [class.uk-button-primary]="isSavePrimary"
          *ngIf="(auth.user$ | async)?.displayName && editMode">
          <span uk-icon="icon: upload" *ngIf="!isSaveLoading"></span>
          <span uk-spinner="ratio: 0.5" *ngIf="isSaveLoading"></span>
          Sauvegarder</button>
      </div>
    </div>

    <table class="uk-table uk-table-divider">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Terminé ?</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let mych of mycategory.mychallenges">
          <td>{{ mych.challenge.label.fr }}</td>
          <td *ngIf="!editMode">
            <span class="uk-badge done-inactive" [class.done-active]="mych.done">Terminé</span>
            <ng-container *ngIf="mych.challenge.missions">
              <span *ngFor="let m of [1, 2, 3]"
                class="star-inactive"
                uk-icon="star"
                [class.star-active]="m <= mych.nbMissions">
              </span>
            </ng-container>
          </td>
          <td *ngIf="editMode">
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

  </div>
  `,
  styles: [`
    .pointer {
      cursor: pointer;
    }
  `]
})
export class MychallengesComponent implements OnInit {

  public authUser: User;
  public user: User;
  public ranks: Rank[];
  public original: MyCategory[];
  public mycategories: MyCategory[];
  public mycategory: MyCategory;
  public totalPoints: number;
  public rank: string;
  public editMode: boolean;
  public isSavePrimary = false;
  public isSaveLoading = false;
  public showLastChangeDateWarning: boolean;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public data: DataService,
    public game: GameService,
    public auth: AuthService,
  ) { }

  ngOnInit() {
    this.editMode = false;
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.getMyCategoriesFromTag(params.get('id'))
       .subscribe(mycategories => {
          this.mycategories = mycategories;

          // init original value
          if (!this.original) {
            this.original = this.createClone(mycategories);
          }

          // update current category
          this.updateCategory();

          // refresh total points & rank
          this.refreshRank();

          // check last change date
          this.checkLastChangeDate();
       });
      this.data.getRanks()
        .subscribe(ranks => this.ranks = ranks);
    });
    this.auth.user$.subscribe(user => this.authUser = user);
  }

  /**
   * Create a copy of mycategories (needed if editMode is cancelled)
   * @param mycategories
   */
  private createClone(mycategories) {
    const res = [];
    for (const mycategory of mycategories) {
      const cat = new Category(mycategory.category);
      const mycat = new MyCategory(cat);
      for (const mych of mycategory.mychallenges) {
        const ch = new Challenge(mych.challenge);
        mycat.mychallenges.push(new MyChallenge(ch, mych.done, mych.nbMissions));
      }
      res.push(mycat);
    }
    return res;
  }

  /**
   * Show warning if the score is obsolete
   */
  checkLastChangeDate() {
    this.data.getLastChangeDate()
      .subscribe(lastChangeDate => {
        this.showLastChangeDateWarning = this.user.rank.date.toDate() < lastChangeDate;
      });
  }

  /**
   * Get mycategories from user tag
   * @param tag
   */
  getMyCategoriesFromTag(tag: string) {

    // parse tag
    tag = tag.replace('-', '#');

    return this.data.getUserFromTag(tag)
      .pipe(
        flatMap(user => {
          this.user = user;
          return this.data.getMyCategories(user);
        })
      );
  }

  /**
   * Display the detailed challenges of a category
   * @param mycat
   */
  displayCategory(mycat: MyCategory) {
    this.mycategory = mycat;
  }

  /**
   * Update the current category (needed if editMode has been cancelled)
   */
  updateCategory() {
    if (this.mycategory) {
      const mycat = this.mycategories.find(c => c.category.uid === this.mycategory.category.uid);
      this.displayCategory(mycat);
    }
  }

  /**
   * Returns true if the authUser is the same as the profile user
   */
  isMyProfile() {
    return (this.authUser.getProfileLink() === this.router.url);
  }

  /**
   * In edit mode, the form is editable
   */
  toggleEditMode() {
    // cancel current changes
    if (this.editMode && this.original) {
      // reset all changes
      this.mycategories = this.createClone(this.original);

      // update current category
      this.updateCategory();

      // refresh total points & rank
      this.refreshRank();
    }

    this.editMode = !this.editMode;
  }

  /**
   * Modify a myChallenge
   * @param c
   * @param nb
   */
  markAsDone(c: MyChallenge, nb: number) {
    if (c.done && nb === c.nbMissions) {
      c.done = false;
      c.nbMissions = 0;
    } else {
      c.done = true;
      c.nbMissions = nb;
    }

    // find differences from original value
    this.checkChanges();

    // refresh total points & rank
    this.refreshRank();
  }

  /**
   * Refresh totals points & rank
   */
  refreshRank() {
    this.totalPoints = this.game.getTotalPoints(this.mycategories);
    this.rank = this.game.getRank(this.totalPoints, this.ranks);
  }

  /**
   * Find differences from original value
   */
  checkChanges() {
    const toSet = [];
    const toDelete = [];
    const A = this.buildMyChallenges(this.original);
    const B = this.buildMyChallenges(this.mycategories);

    for (const e of B) {
      const found = A.find(f => f.challenge === e.challenge);
      if (!found || found.nbMissions !== e.nbMissions) {
        toSet.push({
          c: e.challenge, // challenge
          n: e.nbMissions // nbMissions
        });
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

  /**
   * Export mycategories for easy check changes
   * @param mycategories
   */
  buildMyChallenges(mycategories) {
    const res = [];
    for (const mycategory of mycategories) {
      for (const mychallenge of mycategory.mychallenges) {
        if (mychallenge.done) {
          res.push(mychallenge.export());
        }
      }
    }
    return res;
  }

  /**
   * Save new score
   */
  async save() {
    const [toSet, toDelete] = this.checkChanges();
    this.isSaveLoading = true;
    const user = await this.auth.getUser();
    this.game.save(toSet, toDelete, user, this.totalPoints, () => {
      this.isSavePrimary = false;
      this.isSaveLoading = false;

      // replace original value
      this.original = this.createClone(this.mycategories);
    });
  }

}
