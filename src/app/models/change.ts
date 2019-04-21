import { Model } from './model';
import { firestore } from 'firebase';
import Timestamp = firestore.Timestamp;

/**
 * Examples:
 * "Création de la catégorie 'Abysses dangereuses' par Menencia."
 * "Mise à jour du challenge 'Bahamut' ('Abysses dangereuses') par Menencia."
 * "Suppression du rang 'Prince défait' par Menencia."
 */
export class Change extends Model {
  uid: string;
  label: string;
  args: object;
  author: string;
  date: Timestamp;
  important: boolean;

  constructor(changeObj) {
    super(changeObj, {
      label: null,
      args: null,
      author: null,
      date: null,
      important: false,
    });
  }

}
