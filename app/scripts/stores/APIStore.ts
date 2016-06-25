import {observable, computed} from 'mobx';
import SprinklersAPI, {APIResponse} from "../util/SprinklersAPI";

/**
 * Base class for stores that perform requests to the SprinklersAPI
 */
export default class APIStore {
  /**
   * The SprinklersAPI instance to be used by this store
   * @type {SprinklersAPI}
   */
  sprinklersApi:SprinklersAPI;

  /**
   * How many requests to the server are currently active
   * @type {number}
   */
  @observable activeRequests:number = 0;

  /**
   * @returns {boolean} If the store is currently waiting for data to load
   */
  @computed get isLoading():boolean {
    return this.activeRequests > 0;
  }

  /**
   * Creates the APIStore.
   * @param sprinklersApi The sprinklers api instance to use
   */
  constructor(sprinklersApi:SprinklersAPI) {
    this.sprinklersApi = sprinklersApi;
  }

  /**
   * Performs a managed request (keeps track of when it starts and finishes)
   * @param requestFunction The function which performs the request
   * @returns {Promise<T>} The result returned from the function
   */
  managedRequest<T>(requestFunction:() => Promise<T>):Promise<T> {
    this.activeRequests++;
    return requestFunction()
      .finally(() => {
        this.activeRequests--;
      });
  }
}