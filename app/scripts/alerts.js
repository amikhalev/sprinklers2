import {EventEmitter} from 'events';

class AlertsService extends EventEmitter {
  add(type, message, timeout) {
    this.emit('add', type, message, timeout);
  }
}

const instance = new AlertsService();

export default instance;
