import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { User } from '../models/user';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;

  userRef: AngularFirestoreDocument<any>;

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore,
    public router: Router,
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

  loginWithGoogle() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(credential => {
        this.updateUser(credential.user);
      });
  }

  createAccount(email: string, password: string) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error)
      });
  }

  loginWithPassword(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error);
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

  getUser() {
    return this.user$.pipe(take(1)).toPromise();
  }

  saveUser(userSubset) {
    return this.userRef.set(userSubset, { merge: true });
  }
}
