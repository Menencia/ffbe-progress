import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { flatMap } from 'rxjs/operators';
import { DataService } from '../data.service';
import { Rank } from '../models/rank';
import { GameService } from '../game.service';

@Component({
  selector: 'app-player',
  template: `
  <h2 *ngIf="user">Profil de {{ user.displayName }}</h2>
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
            </li>
        </ul>
    </div>
  </div>
  `,
  styles: []
})
export class PlayerComponent implements OnInit {

  public user;
  public ranks;
  public mycategories;

  totalPoints: number;
  rank: Rank;

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

}
