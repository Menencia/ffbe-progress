import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { Model } from './model';

export class User extends Model {
  uid: string;
  name: string;
  displayName: string;
  tag: string;
  email: string;
  admin: boolean;
  lastConnected: Date;
  banned: boolean;
  rank: {
    points: number;
    date: Timestamp;
    obsolete: boolean;
  };

  constructor(userData) {
    super(userData, {
      name: null,
      displayName: null,
      tag: null,
      email: null,
      admin: false,
      lastConnected: null,
      banned: false,
      rank: null,
    });
  }

  getName() {
    if (this.displayName) {
      return this.displayName;
    }
    return this.name;
  }

  getProfileLink() {
    if (this.tag) {
      // stringify tag
      return '/profile/' + this.tag.replace('#', '-');
    }
    return null;
  }

}
