import {API_URL, SSE_URL, SSE_EVENT_TYPES} from '../constants/sprinklersApi.js';
import {EventEmitter} from 'events';

const FETCH_INIT = {
  credentials: 'same-origin'
};

class RequestError extends Error {
  constructor(error) {
    super();
    this.name = error.statusText;
    this.message = error.message;
    this.status = error.status;
    this.data = error.data;
  }
}

function apiHandler(response) {
  return response.json()
    .then(json => {
      if (!response.ok) {
        throw new RequestError(json);
      } else {
        return json;
      }
    });
}

function fetchApi(request) {
  return fetch(request, FETCH_INIT)
    .then(apiHandler);
}

export function fetchPrograms() {
  return fetchApi(`${API_URL}/programs`)
    .then(res => res.data);
}

export function runProgram(id) {
  return fetchApi(new Request(`${API_URL}/programs/${id}/run`, {
    method: 'POST'
  }));
}

export function fetchSections() {
  return fetchApi(`${API_URL}/sections`)
    .then(res => res.data);
}

export function toggleSection(id) {
  return fetchApi(new Request(`${API_URL}/sections/${id}/toggle`, {
    method: 'POST'
  }));
}

export function runSection(id, time) {
  return fetchApi(new Request(`${API_URL}/sections/${id}/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      time
    })
  }));
}

export class SSE extends EventEmitter {
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