import { Model } from './model';
import { firestore } from 'firebase';
import Timestamp = firestore.Timestamp;

export enum ChangeType {
  Category = 'cat',
  Challenge = 'ch',
  Rank = 'r',
}

export enum ChangeOperation {
  Create = 'c',
  Update = 'u',
  Delete = 'd',
}

/**
 * Examples:
 * "Création de la catégorie 'Abysses dangereuses' par Menencia."
 * "Mise à jour du challenge 'Bahamut' ('Abysses dangereuses') par Menencia."
 * "Suppression du rang 'Prince défait' par Menencia."
 */
export class Change extends Model {
  uid: string;
  name: string;
  type: ChangeType;
  operation: ChangeOperation;
  author: string;
  date: Timestamp;
  important: boolean;

  constructor(changeObj) {
    super(changeObj, {
      name: null,
      type: null,
      operation: null,
      author: null,
      date: null,
      important: false,
    });
  }

}
