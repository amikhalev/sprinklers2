import {SprinklersAPI, SprinklersEvents} from './util/sprinklersApi';

const API_URL = '/api';
const SSE_URL = `${API_URL}/sse`;

export const sprinklersApi = new SprinklersAPI(API_URL);
export const sprinklersEvents = new SprinklersEvents(SSE_URL);