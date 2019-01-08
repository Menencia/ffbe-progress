import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Challenge } from './models/challenge';
import { MyChallenge } from './models/my_challenge';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <app-login></app-login>
      <app-challenges [challenges]="challenges"></app-challenges>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'app';
  challenges: MyChallenge[];

  constructor(public http: HttpClient) {
    this.challenges = [];
  }

  ngOnInit() {
    this.http.get('assets/missions.json').subscribe((data: Challenge[]) => {
      this.challenges = data.map((challenge: Challenge) => {
        return new MyChallenge(challenge);
      });
    });
  }
}
