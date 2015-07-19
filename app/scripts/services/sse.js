import {EventEmitter} from 'events';

const types = ['sections', 'programs'];

class SseService extends EventEmitter {
  constructor() {
    super();
    this.eventSource = new EventSource('/api/sse');
    types.forEach(type => {
      this.eventSource.addEventListener(type, e => {
        this.emit(type, JSON.parse(e.data));
      });
    });
  }
}

const instance = new SseService();

export default instance;
