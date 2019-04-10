import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Change } from '../models/change';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ChangeService {

  constructor(
    public afs: AngularFirestore,
    public data: DataService,
  ) { }

  async add(change: Change) {
    // get all changes
    const changes = await this.data.getChanges();

    // delete first change if too many
    if (changes.length >= 10) {
      this.afs.doc(`changes/${changes[changes.length - 1].uid}`).delete();
    }

    // add new change
    this.afs.collection('changes').add(change.export());
  }

}
