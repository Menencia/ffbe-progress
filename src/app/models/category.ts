export class Category {
  uid: string;
  name: {fr: string};
  position: number;

  constructor(uid: string, name: {fr: string}, position: number) {
    this.uid = uid;
    this.name = name;
    this.position = position;
  }

  export() {
    return {
      name: this.name,
      position: this.position
    };
  }
}
