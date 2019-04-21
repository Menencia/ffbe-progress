import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Change } from '../models/change';
import { DataService } from './data.service';
import { User } from '../models/user';
import { AuthService } from './auth.service';

enum ChangeType {
  Category = 'cat',
  Challenge = 'ch',
  Rank = 'r',
}

enum ChangeOperation {
  Create = 'c',
  Update = 'u',
  Delete = 'd',
}

@Injectable({
  providedIn: 'root'
})
export class ChangeService {

  user: User;

  constructor(
    public afs: AngularFirestore,
    public data: DataService,
    public auth: AuthService,
  ) {
    this.initUser();
  }

  async initUser() {
    this.user = await this.auth.getUser();
  }

  async add(change: Change) {
    // get all changes
    const changes = await this.data.getChangesPromise();

    // delete first change if too many
    if (changes.length >= 10) {
      this.afs.doc(`changes/${changes[changes.length - 1].uid}`).delete();
    }

    // add new change
    this.afs.collection('changes').add(change.export());
  }

  // Categories

  categoryCreate(name, important) {
    this._add(
      name,
      important,
      ChangeType.Category,
      ChangeOperation.Create,
    );
  }

  categoryUpdate(name, important) {
    this._add(
      name,
      important,
      ChangeType.Category,
      ChangeOperation.Update,
    );
  }

  categoryDelete(name, important) {
    this._add(
      name,
      important,
      ChangeType.Category,
      ChangeOperation.Delete,
    );
  }

  // Challenges

  challengeCreate(name, important) {
    this._add(
      name,
      important,
      ChangeType.Challenge,
      ChangeOperation.Create,
    );
  }

  challengeUpdate(name, important) {
    this._add(
      name,
      important,
      ChangeType.Challenge,
      ChangeOperation.Update,
    );
  }

  challengeDelete(name, important) {
    this._add(
      name,
      important,
      ChangeType.Challenge,
      ChangeOperation.Delete,
    );
  }

  // Ranks

  rankCreate(name, important) {
    this._add(
      name,
      important,
      ChangeType.Rank,
      ChangeOperation.Create,
    );
  }

  rankUpdate(name, important) {
    this._add(
      name,
      important,
      ChangeType.Rank,
      ChangeOperation.Update,
    );
  }

  rankDelete(name, important) {
    this._add(
      name,
      important,
      ChangeType.Rank,
      ChangeOperation.Delete,
    );
  }

  // Private function

  _add(name, important, type, operation) {
    this.add(new Change({
      label: `CHANGE.${type}_${operation}`,
      args: {name},
      author: this.user.uid,
      date: new Date(),
      important,
    }));
  }

}
