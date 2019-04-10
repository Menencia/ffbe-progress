import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { combineLatest, of  } from 'rxjs';

import { User } from '../models/user';
import { Category } from '../models/category';
import { MyCategory } from '../models/my_category';
import { Challenge } from '../models/challenge';
import { MyChallenge } from '../models/my_challenge';
import { Rank } from '../models/rank';
import { Change } from '../models/change';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  players = null;

  constructor(public afs: AngularFirestore) { }

  collection(col: string, options?: QueryFn) {
    return this.afs
      .collection(col, options)
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const uid = a.payload.doc.id;
          const data = a.payload.doc.data();
          return {uid, ...data};
        }))
      );
  }

  getUsersRanking() {
    const options = ref => ref
      .orderBy('rank.points', 'desc');
    return this.collection('users', options)
    .pipe(
      map(users => users.map(userObj => new User(userObj)) )
    );
  }

  getChallenges() {
    const options = ref => ref
      .orderBy('position', 'asc');
    return this.collection('challenges', options)
    .pipe(
      map(challenges => challenges.map(challengeObj => new Challenge(challengeObj)) )
    );
  }

  getChallengesFromCategory(categoryUid) {
    const options = ref => ref
      .where('category', '==', categoryUid)
      .orderBy('position', 'asc');
    return this.collection('challenges', options)
    .pipe(
      map(challenges => challenges.map(challengeObj => new Challenge(challengeObj)) )
    );
  }

  getCategories() {
    const options = ref => ref.orderBy('position', 'asc');
    return this.collection('categories', options)
      .pipe(
        map(categories => categories.map(categoryObj => new Category(categoryObj)) )
      );
  }

  getRanks() {
    const options = ref => ref.orderBy('level', 'asc');
    return this.collection('ranks', options)
      .pipe(
        map(ranks => ranks.map(rankObj => new Rank(rankObj)) )
      );
  }

  getMyChallenges(user) {
    if (!user) {
      return of([]);
    }
    return this.collection(`users/${user.uid}/mychallenges`);
  }

  getMyCategories(user) {
    return combineLatest([
      this.getChallenges(),
      this.getCategories(),
      this.getMyChallenges(user)
    ]).pipe(
      map(data => {
        const [challenges, categories, mychallenges] = data;
        // challenges & categories
        let done, nbMissions;
        const mycategories = [];
        for (const category of categories) {
          const mycategory = new MyCategory(category);
          for (const challenge of challenges) {
            if (challenge.category !== category.uid) {
              continue;
            }
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
          mycategories.push(mycategory);
        }
        return mycategories;
      })
    );
  }

  getUserFromTag(tag) {
    const options = ref => ref.where('tag', '==', tag);
    return this.collection('users', options).pipe(
      map(users => new User(users[0]))
    );
  }

  getChanges() {
    const options = ref => ref.orderBy('date', 'desc');
    const obs = this.collection('changes', options).pipe(
      map(changes => changes.map(changeObj => new Change(changeObj)) )
    );
    return new Promise<Change[]>((resolve, reject) => {
      obs.subscribe((response) => {
        resolve(response);
      }, reject);
    });
  }

}
