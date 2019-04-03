export class Model {

  constructor(dataObj: object, public defaults: object) {
    const data = Object.assign({}, this.defaults, dataObj);
    for (const i in data) {
      if (data.hasOwnProperty(i)) {
        this[i] = data[i];
      }
    }
  }

  export() {
    const res = {};
    for (const i in this.defaults) {
      if (this.defaults.hasOwnProperty(i)) {
        res[i] = this[i];
      }
    }
    return res;
  }

}
