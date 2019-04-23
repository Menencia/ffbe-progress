import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { flatMap } from 'rxjs/operators';

import { Rank } from '../models/rank';
import { MyCategory } from '../models/my_category';
import { User } from '../models/user';

import { GameService } from '../services/game.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-mychallenges',
  template: `
  <h2 *ngIf="user" class="uk-heading-divider">Profil de {{ user.displayName }}</h2>

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
          <td>
            <span class="uk-badge done-inactive" [class.done-active]="mych.done">Terminé</span>
            <ng-container *ngIf="mych.challenge.missions">
              <span *ngFor="let m of [1, 2, 3]"
                class="star-inactive"
                uk-icon="star"
                [class.star-active]="m <= mych.nbMissions">
              </span>
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

  public user: User;
  public ranks: Rank[];
  public mycategories: MyCategory[];
  public mycategory: MyCategory;

  totalPoints: number;
  rank: string;

  constructor(
    public route: ActivatedRoute,
    public data: DataService,
    public game: GameService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.getMyCategoriesFromTag(params.get('id'))
       .subscribe(mycategories => {
          this.mycategories = mycategories;

          // refresh total points & rank
          this.totalPoints = this.game.getTotalPoints(this.mycategories);
          this.rank = this.game.getRank(this.totalPoints, this.ranks);
       });
      this.data.getRanks()
        .subscribe(ranks => this.ranks = ranks);
    });
  }

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

  displayCategory(mycat: MyCategory) {
    this.mycategory = mycat;
  }

}
