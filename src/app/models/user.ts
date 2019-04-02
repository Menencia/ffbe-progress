import {firestore} from 'firebase/app';
import Timestamp = firestore.Timestamp;

export class User {
  uid: string;
  name: string;
  email: string;
  admin: boolean;
  lastConnected: Date;
  banned: boolean;

  // ranking
  points: number;
  dateRanking: Timestamp;
}
