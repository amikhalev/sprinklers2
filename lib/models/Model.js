import {resolve, promisifyAll} from 'bluebird';
import {assign, pick} from 'lodash';
import {join} from 'path';
const {readFileAsync, writeFileAsync} = promisifyAll(require('fs'));

const INIT_DATA_PATH = join(__dirname, '..', 'init-data.json');
const DATA_PATH = join(__dirname, '..', 'test-data.json');

let _dataCache = null;

function readData(path = DATA_PATH) {
  if (_dataCache != null) {
    return Promise.resolve(_dataCache);
  } else {
    return readFileAsync(path)
      .then(json => JSON.parse(json))
      .then(data => _dataCache = data);
  }
}

function writeData(data, path = DATA_PATH) {
  _dataCache = data;
  return writeFileAsync(path, JSON.stringify(data));
}

export default class Model {
  constructor(data) {
    let props = this.constructor.persistantProps;
    assign(this, pick(data, props.concat(['id'])));
  }

  static list() {
    if (!this.instances) {
      return readData()
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

  static findById(id) {
    if (!this.instances) {
      this.list();
    }
    return this.instances[id];
  }

  save() {
    return readData()
      .then(data => {
        data[this.constructor.name][this.id] = pick(this, this.constructor.persistantProps);
        return data;
      })
      .then(writeData);
  }
}
