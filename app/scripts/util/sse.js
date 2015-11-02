import {EventEmitter} from 'events';
import {SSE_URL, SSE_EVENT_TYPES} from '../constants/sprinklersApi.js';

let sse = new EventEmitter();
sse.eventSource = new EventSource(SSE_URL);
SSE_EVENT_TYPES.forEach(type => {
  sse.eventSource.addEventListener(type, e => {
    sse.emit(type, JSON.parse(e.data));
  });
});

export default sse;
