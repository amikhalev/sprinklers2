import {observable, computed, autorun} from 'mobx';
import Model from './Model';
import SectionStore from '../stores/SectionStore';
import {APIResponse} from "../util/SprinklersAPI";

/**
 * Model representing a sprinkler section.
 */
export default class Section extends Model {
  static props:Array<string> = ['name', 'pin', 'value'];

  store:SectionStore;

  /**
   * The name of the section
   * @type {string}
   */
  @observable name:string = '';

  /**
   * The hardware pin number of the section on the rPI
   * @type {number}
   */
  @observable pin:number = null;

  /**
   * The current value of the section. Either true (running) or false (not running)
   * @type {boolean}
   */
  @observable value:boolean = null;

  /**
   * If the section is currently running for a period of time, the approximate time
   * that the section will be finished running.
   * @type {Date}
   */
  @observable endTime:Date = null;

  /**
   * The remaining run time left on the section, if it is running. Null otherwise.
   * @type {number}
   */
  @observable runTimeLeft:number = null;

  secondTimer:number = null;

  /**
   * Creates a new Section model
   * @param store {SectionStore} The parent store
   * @param id {number} The id of the section. Must correspond to an id on the server.
   */
  constructor(store:SectionStore, id:number) {
    super(id);
    this.store = store;
    autorun(() => this.ensureTimerIsRunning());
  }

  updateFromJson(json:any) {
    super.updateFromJson(json);
    if (json.endTime) {
      this.endTime = new Date(json.endTime);
    } else {
      this.endTime = null;
    }
  }

  toJson():any {
    const json = super.toJson();
    json.endTime = this.endTime.toString();
    return json;
  }

  /**
   * Toggles the value of this section.
   * @returns {Promise<APIResponse>}
   */
  toggle():Promise<APIResponse> {
    return this.store.managedRequest(() =>
      this.store.sprinklersApi.toggleSection(this.id)
        .catch(err => {
          this.store.alertHandler.addDangerAlert(`Failed to toggle section: ${err.message}`)
        })
    );
  }

  /**
   * Runs this section for a period of time
   * @param time The time to run for in seconds
   * @returns {Promise<APIResponse>}
   */
  runFor(time:number):Promise<APIResponse> {
    return this.store.managedRequest(() =>
      this.store.sprinklersApi.runSection(this.id, time)
        .catch((err) => {
          this.store.alertHandler.addDangerAlert(`Failed to run section: ${err.message}`);
        })
    );
  }

  private ensureTimerIsRunning() {
    if (this.endTime) {
      this.startTimeUpdater();
    } else {
      this.stopTimeUpdater();
    }
  }

  private startTimeUpdater() {
    this.stopTimeUpdater();
    this.updateTimeLeft();
  }

  private stopTimeUpdater() {
    clearTimeout(this.secondTimer);
    this.secondTimer = null;
  }

  private updateTimeLeft() {
    this.runTimeLeft = this.getTimeLeft();
    // if it has already finished running, there is no need to continue the loop.
    if (this.runTimeLeft === null) {
      return;
    }
    const msNow = (new Date()).getMilliseconds();
    const msEnd = this.endTime.getMilliseconds();
    let msUntilNextInterval:number;
    if (msNow < msEnd) { // next interval is in the same second
      // just the difference in ms
      msUntilNextInterval = msEnd - msNow;
    } else if (msNow > msEnd) { // next interval is in next second
      // one second minus the time ellapsed in that second so far
      msUntilNextInterval = 1000 - (msNow - msEnd);
    } else { // next interval is precisely in 1 second
      msUntilNextInterval = 1000;
    }
    this.secondTimer = setTimeout(() => {
      this.updateTimeLeft();
    }, msUntilNextInterval);
  }

  private getTimeLeft() {
    const currentTime = new Date();
    const endTime = this.endTime;
    if (!endTime) {
      return null;
    }
    const msLeft = endTime.getTime() - currentTime.getTime();
    const secondsLeft = Math.ceil(msLeft / 1000);
    if (secondsLeft > 0) {
      return secondsLeft;
    } else {
      return null;
    }
  }
}