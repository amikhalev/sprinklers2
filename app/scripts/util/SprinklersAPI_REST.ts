import {EventEmitter} from 'events';
import * as _ from 'lodash';
import * as Promise from 'bluebird';
import SprinklersAPI, {APIResponse, ListUpdateCallback} from "./SprinklersAPI";

/**
 * An error that has occured with the sprinklers API. Include server error and
 * network errors.
 */
export class RequestError extends Error {
  /**
   * The status code of the error
   */
  status:number;

  /**
   * Optional data associated with the error
   */
  data:Object;

  constructor(error:any) {
    super();
    this.name = error.statusText;
    this.message = error.message;
    this.status = error.status;
    this.data = error.data;
  }
}

// Helper function for handling API requests
function apiHandler(response:Response) {
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
        return new APIResponse(json);
      }
    })
}

/**
 * A class for using the API provided by the sprinklers server.
 */
export default class SprinklersAPI_REST extends EventEmitter implements SprinklersAPI {
  apiURL:string;
  eventSource:EventSource;

  /**
   * Creates a new SprinklersAPI instance
   * @param apiURL {string} The URL of the api. Should be something like "http://server/api"
   */
  constructor(apiURL:string) {
    super();
    this.apiURL = apiURL;
  }

  /**
   * Starts the SSE connection with the server.
   * @see onSectionsUpdate
   * @see onProgramsUpdate
   */
  startEvents() {
    this.eventSource = new EventSource(`${this.apiURL}/sse`);

    ['sections', 'programs'].forEach(type => {
      this.eventSource.addEventListener(type, e => {
        this.emit(type, JSON.parse((e as any).data));
      });
    });
  }

  // Helper function for making API requests
  private fetchApi(endpoint:string, data:Object = {}):Promise<APIResponse> {
    const request = `${this.apiURL}/${endpoint}`;
    return Promise.resolve(fetch(request, data))
      .then(apiHandler)
      .catch(err => {
        throw err;
      });
  }

  fetchPrograms():Promise<Array<Object> > {
    return this.fetchApi('programs')
      .then(res => res.data);
  }

  onProgramsUpdate(callback:ListUpdateCallback) {
    this.on('programs', callback);
  }

  runProgram(id:number):Promise<APIResponse> {
    return this.fetchApi(`programs/${id}/run`, {
      method: 'POST'
    });
  }

  updateProgram(id:number, data:Object):Promise<APIResponse> {
    return this.fetchApi(`programs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  fetchSections():Promise<Array<Object> > {
    return this.fetchApi('sections')
      .then(res => res.data);
  }

  onSectionsUpdate(callback:ListUpdateCallback) {
    this.on('sections', callback);
  }

  toggleSection(id:number):Promise<APIResponse> {
    return this.fetchApi(`sections/${id}/toggle`, {
      method: 'POST'
    });
  }

  runSection(id:number, time:number):Promise<APIResponse> {
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