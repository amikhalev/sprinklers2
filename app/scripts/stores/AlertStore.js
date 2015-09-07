import AlertActions from '../actions/AlertActions.js';
import {createStore} from 'reflux';
import {OrderedMap} from 'immutable';
import {StateMixin} from './StoreMixins.js';

export default createStore({
  mixins: [StateMixin],
  nextId: 0,
  alerts: new OrderedMap(),

  init() {
    this.listenToMany(AlertActions);
  },

  getState() {
    return {
      alerts: this.alerts
    };
  },

  add(type, message, timeout) {
    var id = this.nextId++;
    var alert = {
      type, message
    };
    this.alerts = this.alerts.set(id, alert);
    this.stateUpdated();
    if (timeout === true) {
      timeout = 2.0;
    }
    if (typeof timeout === 'number') {
      setTimeout(() => AlertActions.remove(id), timeout * 1000);
    }
    return id;
  },

  remove(id) {
    this.alerts = this.alerts.delete(id);
    this.stateUpdated();
  }
});

window.onerror = function(msg, url, line, col) {
  AlertActions.add('danger', `Uncaught Exception (${url}:${line}:${col}):\n${msg}`);
};
