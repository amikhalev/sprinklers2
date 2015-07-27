import {EventEmitter} from 'events';

class AlertsService extends EventEmitter {
  add(type, message, timeout) {
    this.emit('add', type, message, timeout);
  }
}

const instance = new AlertsService();

window.onerror = function(msg, url, line, col) {
  instance.add('danger', `Uncaught Exception (${url}:${line}:${col}):\n${msg}`);
};

export default instance;
