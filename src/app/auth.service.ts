import { Injectable } from '@angular/core';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { User } from './models/user';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;

  userRef: AngularFirestoreDocument<any>;

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.userRef = this.afs.doc<User>(`users/${user.uid}`);
          return this.userRef.valueChanges().pipe(
            map((data) => {
              if (data) {
                return new User({uid: user.uid, ...data});
              }
              return null;
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(credential => {
        this.updateUser(credential.user);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  private updateUser(user) {

    const userObj: User = new User({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      lastConnected: moment().toDate()
    });

    return this.userRef.set(userObj.export(), { merge: true });
  }

  saveUser(userSubset) {

    return this.userRef.set(userSubset, { merge: true });

  }
}
