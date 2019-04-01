import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-player',
  template: `
    test
  `,
  styles: []
})
export class PlayerComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(function(params: ParamMap) {
      console.log(params.get('id'));
    })
  }

  loadPlayer(id) {
    // combineLatest([
    //   this.getChallenges(),
    //   this.getCategories(),
    //   this.getRanks(),
    //   this.getMyChallenges()
    // ]).subscribe(data => {
    //   const [challenges, categories, ranks, mychallenges] = data;
    //   this._load(challenges, categories, ranks, mychallenges);
    // });
  }

}
