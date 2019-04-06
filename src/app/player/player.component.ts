import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { flatMap } from 'rxjs/operators';
import { DataService } from '../data.service';

@Component({
  selector: 'app-player',
  template: `
    test
  `,
  styles: []
})
export class PlayerComponent implements OnInit {

  public user;
  public ranks;
  public mycategories;

  constructor(
    public route: ActivatedRoute,
    public data: DataService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.getMyCategoriesFromCustomUrl(params.get('id'))
       .subscribe(mycategories => {
         this.mycategories = mycategories;
       });
      this.data.getRanks()
        .subscribe(ranks => this.ranks = ranks);
    });
  }

  getMyCategoriesFromCustomUrl(customUrl) {
    return this.data.getUserFromCustomUrl(customUrl)
      .pipe(
        flatMap(user => {
          this.user = user;
          return this.data.getMyCategories(user);
        })
      );
  }

  // getMyChallenges() {
  //   return this.auth.user$.pipe(
  //     flatMap(user => this._getMyChallenges(user))
  //   );
  // }

}
