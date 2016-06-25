import {observable} from 'mobx';
import Model from "./Model";
import AlertStore from "../stores/AlertStore";

export default class Alert extends Model {
  static props = ['style', 'contents'];

  store:AlertStore;

  /**
   * The style of the alert. Corresponds to Bootstrap alert styles.
   * @type {string}
   */
  @observable style:string = '';

  /**
   * The contents of the alert. Must be something renderable by React.
   * @type {string}
   */
  @observable contents:any = '';

  /**
   * Creates a new Alert model
   * @param store The parent store of the Alert
   * @param id The id of the Alert
   */
  constructor(store:AlertStore, id:number) {
    super(id);
    this.store = store;
  }

  /**
   * Removes this alert from the parent store.
   */
  remove() {
    this.store.removeAlert(this.id);
  }
}