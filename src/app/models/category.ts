export class Category {
  uid: string;
  name: {fr: string};
  position: number;

  constructor(name: {fr: string}, position) {
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
