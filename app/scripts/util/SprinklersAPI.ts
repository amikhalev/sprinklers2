/**
 * Represents a response from the server
 */
export class APIResponse {
  /**
   * The status code of the response
   * @type {number}
   */
  status:number = 0;

  /**
   * An optional string for the message describing the response
   * @type {?string}
   */
  message:string = '';

  /**
   * The data returned in response
   * @type {*}
   */
  data:any = null;

  /**
   * Constructs a new Response
   * @param json {Object} The json data to construct the response from
   */
  constructor(json:Object) {
    _.assign(this, _.pick(json, ['status', 'message', 'data']));
  }
}

/**
 * A callback for receiving a list of new objects
 * @callback ListUpdateCallback
 * @param {Array.<Object>} The new objects
 */
export type ListUpdateCallback = (sections:Array<Object>) => void;

/**
 * An interface for the sprinklers controller api.
 */
interface SprinklersAPI {
  /**
   * Fetches the list of programs from the server
   * @returns {Promise<Array<Object>>} A promise resolving to the list of programs
   */
  fetchPrograms():Promise<Array<Object> >;

  /**
   * Registers a callback for when a programs update is received from the server.
   * @param {ListUpdateCallback} callback
   */
  onProgramsUpdate(callback:ListUpdateCallback);

  /**
   * Runs a program
   * @param id {number} The id of the program to run
   * @returns {Promise<APIResponse>} A promise resolving to the response from the server
   */
  runProgram(id:number):Promise<APIResponse>;

  /**
   * Updates a program on the server
   * @param id {number} The id of the program to update
   * @param data {Object}
   * @returns {Promise<Response>} A promise resolving to the response from the server
   */
  updateProgram(id:number, data:Object):Promise<APIResponse>;

  /**
   * Fetches the list of sections from the server
   * @returns {Promise<Array<Object>>} A promise resolving to the list of sections
   */
  fetchSections():Promise<Array<Object> >;

  /**
   * Registers a callback for when a section update is received from the server.
   * @param {ListUpdateCallback} callback
   */
  onSectionsUpdate(callback:ListUpdateCallback);

  /**
   * Toggles a section on the server
   * @param id {number} The id of the section to toggle
   * @returns {Promise.<APIResponse>} A promise resolving to the response from the server
   */
  toggleSection(id:number):Promise<APIResponse>;

  /**
   * Runs a section for a period of time
   * @param id {number} The id of the section to run
   * @param time {number} The time in seconds to run the section for
   * @returns {Promise.<APIResponse>} A promise resolving to the response from the server
   */
  runSection(id:number, time:number):Promise<APIResponse>;
}
export default SprinklersAPI;