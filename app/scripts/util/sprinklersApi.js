import {API_URL} from '../constants/sprinklersApi.js';

const FETCH_INIT = {
  credentials: 'same-origin'
};

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
  return fetchApi(`${API_URL}/programs`);
}

export function runProgram(id) {
  return fetchApi(new Request(`${API_URL}/programs/${id}/run`, {
    method: 'POST'
  }));
}