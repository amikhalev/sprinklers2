import {observable} from 'mobx';
import Model from "./Model";
import ProgramTime from "./ProgramTime";
import ProgramStore from "../stores/ProgramStore";
import {APIResponse} from "../util/SprinklersAPI";

export interface IProgram {
  /**
   * The name of this program
   * @type {string}
   */
  name: string;

  /**
   * The (later.js) schedule that this program will be run on.
   * @type {string}
   */
  scheduleString:string;

  /**
   * Whether the section is currently enabled or not.
   * @type {boolean}
   */
  enabled:boolean;

  /**
   * The sections and their respective times of this program.
   * @type {Array}
   */
  times:Array<ProgramTime>;
}

/**
 * Model representing a program, which is a sequence of sections to run.
 */
export default class Program extends Model implements IProgram {
  static props = ['name', 'scheduleString', 'enabled'];

  store:ProgramStore;

  /**
   * The name of this program
   * @type {string}
   */
  @observable name:string = '';

  /**
   * The (later.js) schedule that this program will be run on.
   * @type {string}
   */
  @observable scheduleString:string = '';

  /**
   * Whether the section is currently enabled or not.
   * @type {boolean}
   */
  @observable enabled:boolean = null;

  /**
   * The sections and their respective times of this program.
   * @type {Array}
   */
  @observable times:Array<ProgramTime> = [];

  /**
   * Creates a new Program model
   * @param store {ProgramStore} The parent store
   * @param id {number} The id of the program. Must correspond to an id on the server.
   */
  constructor(store:ProgramStore, id:number) {
    super(id);
    this.store = store;
  }

  updateFromJson(json:any) {
    super.updateFromJson(json);
    this.times = json.times.map(time => ProgramTime.fromJson(this, time));
  }

  toJson():any {
    const json = super.toJson();
    json.times = this.times.map(time => time.toJson());
    return json;
  }

  /**
   * Runs this program
   * @returns {Promise<APIResponse>}
   */
  run():Promise<APIResponse> {
    return this.store.managedRequest(() =>
      this.store.sprinklersApi.runProgram(this.id)
        .tap(() => {
          this.store.alertHandler.addSuccessAlert(`Running program "${this.name}"`);
        })
        .catch(err => {
          this.store.alertHandler.addDangerAlert(`Failed to run program: ${err.message}`);
        })
    )
  }

  /**
   * Gets the raw data of this program for editing.
   * @returns {IProgram}
   */
  getEditData():IProgram {
    return <IProgram>this.toJson();
  }

  /**
   * Updates this program on the server.
   * @param editData The data to update. By default, the data stored in this program,
   * but can be anything implementing IProgram
   * @returns {Promise<APIResponse>}
   */
  updateToServer(editData:IProgram = this):Promise<APIResponse> {
    return this.store.managedRequest(() =>
      this.store.sprinklersApi.updateProgram(this.id, editData)
        .catch(err => {
          this.store.alertHandler.addDangerAlert(`Failed to update program: ${err.message}`);
        })
    );
  }
}