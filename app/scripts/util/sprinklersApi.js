import {API_URL, SSE_URL, SSE_EVENT_TYPES} from '../constants/sprinklersApi.js';
import {EventEmitter} from 'events';

class RequestError extends Error {
  constructor(error) {
    super();
    this.name = error.statusText;
    this.message = error.message;
    this.status = error.status;
    this.data = error.data;
  }
}

class SprinklersApi {
  static apiHandler(response) {
    return response.json()
      .then(json => {
        if (!response.ok) {
          throw new RequestError(json);
        } else {
          return json;
        }
      });
  }

  fetchApi(endpoint, data) {
    const request = `${API_URL}/${endpoint}`;
    return fetch(request, data)
      .then(SprinklersApi.apiHandler);
  }

  fetchPrograms() {
    return this.fetchApi('programs')
      .then(res => res.data);
  }

  runProgram(id) {
    return this.fetchApi(`programs/${id}/run`, {
      method: 'POST'
    });
  }

  fetchSections() {
    return this.fetchApi('sections')
      .then(res => res.data);
  }

  toggleSection(id) {
    return this.fetchApi(`sections/${id}/toggle`, {
      method: 'POST'
    });
  }

  runSection(id, time) {
    return this.fetchApi(`sections/${id}/run`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        time
      })
    });
  }
}

export default new SprinklersApi();

export class SprinklersEvents extends EventEmitter {
  constructor() {
    super();
  }

  start() {
    this.eventSource = new EventSource(SSE_URL);
    SSE_EVENT_TYPES.forEach(type => {
      this.eventSource.addEventListener(type, e => {
        this.emit(type, JSON.parse(e.data));
      });
    });
  }
}
