import { Injectable } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

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
}
