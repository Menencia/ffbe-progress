import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { combineLatest, of  } from 'rxjs';
import { User } from './models/user';
import { Category } from './models/category';
import { MyCategory } from './models/my_category';
import { Challenge } from './models/challenge';
import { MyChallenge } from './models/my_challenge';

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

  getChallenges() {
    const options = ref => ref.orderBy('position', 'asc');
    return this.collection('challenges', options);
  }

  getCategories() {
    const options = ref => ref.orderBy('position', 'asc');
    return this.collection('categories', options);
  }

  getRanks() {
    const options = ref => ref.orderBy('level', 'asc');
    return this.collection('ranks', options);
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
          mycategories.push(mycategory);
        }
        return mycategories;
      })
    )
  }

  getUserFromCustomUrl(customUrl) {
    const options = ref => ref.where('customUrl', '==', customUrl);
    return this.collection('users', options).pipe(
      map(users => new User(users[0]))
    );
  }

}
