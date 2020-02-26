import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { map, flatMap, switchMap, last } from 'rxjs/operators';
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
    return this.getLastChangeDate().pipe(
      flatMap(lastChangeDate => this._getUsersRanking(lastChangeDate))
    );
  }

  _getUsersRanking(lastChangeDate) {
    let options;
    options = ref => ref
      .orderBy('rank.points', 'desc')
      .orderBy('rank.date', 'asc');

    return this.collection('users', options)
    .pipe(
      map(users => users.map(userObj => new User(userObj)) )
    );
  }

  getChallenges(categoryUid) {
    const options = ref => ref
      .orderBy('position', 'asc');
    return this.collection(`categories/${categoryUid}/challenges`, options)
    .pipe(
      map(challenges => challenges.map(challengeObj => new Challenge(challengeObj)) )
    );
  }

  getCategories() {
    const options = ref => ref.orderBy('position', 'asc');
    return this.collection('categories', options)
      .pipe(
        map(categories => categories.map(categoryObj => {
          return new Category(categoryObj);
        }) ),
        switchMap(categories => {
          const res = categories.map(category => {
            return this.getChallenges(category.uid)
              .pipe(
                map(challenges => Object.assign(category, {challenges}))
              );
          });
          return combineLatest(...res);
        })
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
      this.getCategories(),
      this.getMyChallenges(user)
    ]).pipe(
      map(data => {
        const [categories, mychallenges] = data;
        // challenges & categories
        let done, nbMissions;
        const mycategories = [];
        for (const category of categories) {
          const mycategory = new MyCategory(category);
          for (const challenge of category.challenges) {
            const mychallenge = mychallenges.find(c => c.uid === challenge.uid);
            if (mychallenge) {
              done = true;
              nbMissions = mychallenge.n;
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
    return this.collection('changes', options).pipe(
      map(changes => changes.map(changeObj => new Change(changeObj)) )
    );
  }

  getChangesPromise() {
    return new Promise<Change[]>((resolve, reject) => {
      this.getChanges().subscribe((response) => {
        resolve(response);
      }, reject);
    });
  }

  getLastChangeDate() {
    const options = ref => ref
      .where('important', '==', true)
      .orderBy('date', 'desc')
      .limit(1);
    return this.collection('changes', options).pipe(
      flatMap(changes => {
        if (changes.length === 0) {
          return of(null);
        }
        return changes.map(changeObj => new Change(changeObj).date.toDate());
      })
    );
  }

}
