import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/auth';
// import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { User } from './models/user';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /*user$: Observable<User>;

  constructor(
    public afAuth: AngularFireAuth,
    public afs: AngularFirestore
  ) {
    this.user$ = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          const userRef = this.afs.doc<User>(`users/${user.uid}`);
          // disable this ?
          userRef.update({
            lastConnected: moment().toDate()
          });
          return userRef.valueChanges();
        } else {
          return Observable.of(null);
        }
      });
  }

  async getUser() {
    return await this.user$.first().toPromise();
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(credential => {
        this.updateUser(credential.user);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  private updateUser(user) {

    const createData: User = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      admin: false,
      lastConnected: moment().toDate(),
      banned: false
    };
    const updateData = {
      name: user.displayName,
      email: user.email,
      lastConnected: moment().toDate(),
    };

    this.afs.doc(`users/${user.uid}`)
      .update(updateData)
      .then(() => {
        // update successful (document exists)
      })
      .catch((error) => {
        // (document does not exists)
        this.afs.doc(`users/${user.uid}`)
          .set(createData);
      });

  }*/
}
