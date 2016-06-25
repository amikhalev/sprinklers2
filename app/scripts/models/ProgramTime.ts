import {observable} from 'mobx';
import Model from "./Model";
import Program from "./Program";

export default class ProgramTime extends Model<Program> {
  static props = ['time', 'programId', 'sectionId'];

  /**
   * The time that this section will be run for (in seconds)
   * @type {number}
   */
  @observable time:number = null;

  /**
   * The immutable id of the program that owns this program time.
   * @type {number}
   */
  programId:number = null;

  /**
   * The id of the section that will be run.
   * @type {number}
   */
  @observable sectionId:number = null;

  constructor(store:Program, id:number) {
    super(store, id);
  }
}