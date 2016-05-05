import {EventEmitter} from 'events';

export class RequestError extends Error {
  constructor(error) {
    super();
    this.name = error.statusText;
    this.message = error.message;
    this.status = error.status;
    this.data = error.data;
  }
}

export class SprinklersAPI {
  constructor(apiURL) {
    this.apiURL = apiURL;
  }

  static apiHandler(response) {
    return response.text()
      .then(text => {
        let json;
        try {
          json = JSON.parse(text)
        } catch (err) {
          throw new Error('Internal Server Error: ' + text);
        }
        if (!response.ok) {
          throw new RequestError(json);
        } else {
          return json;
        }
      })
  }

  fetchApi(endpoint, data) {
    const request = `${this.apiURL}/${endpoint}`;
    return fetch(request, data)
      .then(SprinklersAPI.apiHandler)
      .catch(err => {throw err;});
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

  updateProgram(id, newData) {
    return this.fetchApi(`programs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
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

export const SSE_EVENT_TYPES = [ 'sections', 'programs' ];

export class SprinklersEvents extends EventEmitter {
  constructor(url) {
    super();
    this.url = url;
  }

  start() {
    this.eventSource = new EventSource(this.url);
    SSE_EVENT_TYPES.forEach(type => {
      this.eventSource.addEventListener(type, e => {
        this.emit(type, JSON.parse(e.data));
      });
    });
  }
}
