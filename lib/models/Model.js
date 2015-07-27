import {resolve, promisifyAll} from 'bluebird';
import {assign, pick} from 'lodash';
const fs = promisifyAll(require('fs'));

const DATA = './data.json';

export default class Model {
  constructor(data) {
    let props = this.constructor.persistantProps;
    assign(this, pick(data, props.concat(['id'])));
  }

  static list() {
    if (!this.instances) {
      return fs.readFileAsync(DATA)
        .then(json => JSON.parse(json))
        .get(this.name)
        .map((datum, i) => {
          datum.id = i;
          return new this(datum);
        })
        .tap(instances => this.instances = instances);
    } else {
      return resolve(this.instances);
    }
  }

  save() {
    return fs.readFileAsync(DATA)
      .then(json => JSON.parse(json))
      .then(data => {
        data[this.constructor.name][this.id] = pick(this, this.constructor.persistantProps);
        return data;
      })
      .then(data => JSON.stringify(data))
      .then(json => fs.writeFileAsync(DATA, json));
  }
}
