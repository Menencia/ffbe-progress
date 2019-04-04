import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;
import { Model } from './model';

export class User extends Model {
  uid: string;
  name: string;
  displayName: string;
  customUrl: string;
  email: string;
  admin: boolean;
  lastConnected: Date;
  banned: boolean;
  points: number;
  dateRanking: Timestamp;

  constructor(userData) {
    super(userData, {
      name: null,
      displayName: null,
      customUrl: null,
      email: null,
      admin: false,
      lastConnected: null,
      banned: false,
      points: null,
      dateRanking: null
    });
  }

  getName() {
    if (this.displayName) {
      return this.displayName;
    }
    return this.uid.substring(0, 5);
  }

  getCustomUrl() {
    if (this.customUrl) {
      return '/player/' + this.customUrl;
    } else {
      return '/p/' + this.uid;
    }
  }
}
