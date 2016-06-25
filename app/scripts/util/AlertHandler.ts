/**
 * A timeout for an alert. If number, then it is the time in seconds until the
 * alert disappears. If it is a boolean and true, then it is a default timeout
 * of DEFAULT_TIMEOUT seconds. If it is false or not provided, the alert will
 * never time out and will have to be manually dismissed.
 */
export type AlertTimeout = (number|boolean);

/**
 * The default timeout for an alert
 * @type {number}
 */
export const DEFAULT_TIMEOUT:number = 2.0;

/**
 * An abstract class representing something that can handle alerts.
 */
abstract class AlertHandler {
  /**
   * Adds an alert
   * @param style The style of the alert to add. Corresponds to Bootstrap alert styles
   * @param contents The contents of the alert to display. Must be something renderable
   * by React, such as a string, a React view or a raw html object ({ __html: ... }).
   * @param timeout The optional timeout.
   * @see AlertTimeout
   * @return The id of the alert, to use for removing the alert
   */
  abstract addAlert(style:string, contents:any, timeout?:AlertTimeout):number;

  /**
   * Removes an alert
   * @param id The id of the alert returned by addAlert
   */
  abstract removeAlert(id:number);

  /**
   * Adds a success alert
   * @param contents The contents of the success alert
   * @param timeout The optional timeout.
   * @see AlertTimeout
   */
  addSuccessAlert(contents:any, timeout?:AlertTimeout):number {
    return this.addAlert('success', contents, timeout);
  }

  /**
   * Adds an info alert
   * @param contents The contents of the success alert
   * @param timeout The optional timeout.
   * @see AlertTimeout
   */
  addInfoAlert(contents:any, timeout?:AlertTimeout):number {
    return this.addAlert('info', contents, timeout);
  }

  /**
   * Adds a warning alert
   * @param contents The contents of the success alert
   * @param timeout The optional timeout.
   * @see AlertTimeout
   */
  addWarningAlert(contents:any, timeout?:AlertTimeout):number {
    return this.addAlert('warning', contents, timeout);
  }

  /**
   * Adds a danger alert
   * @param contents The contents of the success alert
   * @param timeout The optional timeout.
   * @see AlertTimeout
   */
  addDangerAlert(contents:any, timeout?:AlertTimeout):number {
    return this.addAlert('danger', contents, timeout);
  }
}

export default AlertHandler;