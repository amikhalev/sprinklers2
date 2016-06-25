import {observable} from 'mobx';
import * as _ from 'lodash';
import Alert from "../models/Alert";
import AlertHandler, {AlertTimeout, DEFAULT_TIMEOUT} from "../util/AlertHandler";

export default class AlertStore extends AlertHandler {
  /**
   * The list of all alerts that are a part of this store
   * @type {Array<Alert>}
   */
  @observable alerts:Array<Alert> = [];

  // The next id to assign to an alert
  nextId:number = 1;

  addAlert(style:string, contents:any, timeout:AlertTimeout):number {
    const alert = new Alert(this, this.nextId++);
    alert.style = style;
    alert.contents = contents;
    this.alerts.push(alert);

    let time = null;
    if (typeof timeout === 'boolean') {
      if (timeout) {
        time = DEFAULT_TIMEOUT;
      }
    } else if (typeof timeout === 'number') {
      time = timeout;
    }

    if (time !== null) {
      // Seconds to ms
      const timeoutMs = time * 1000;
      setTimeout(() => alert.remove(), timeoutMs);
    }

    return alert.id;
  }

  /**
   * Removes an alert from this store
   * @param id The id of the alert to remove
   */
  removeAlert(id:number) {
    _.remove(this.alerts, alert => alert.id === id);
  }
}