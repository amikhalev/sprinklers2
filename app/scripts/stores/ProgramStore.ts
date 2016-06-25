import {observable} from 'mobx';
import * as _ from 'lodash';
import Program from "../models/Program";
import APIStore from "./APIStore";
import SprinklersAPI from "../util/SprinklersAPI";
import AlertHandler from "../util/AlertHandler";

export default class ProgramStore extends APIStore {
  alertHandler:AlertHandler;

  @observable programs:Array<Program> = [];
  @observable isLoading:boolean = false;

  constructor(sprinklersApi:SprinklersAPI, alertHandler:AlertHandler) {
    super(sprinklersApi);
    this.alertHandler = alertHandler;

    this.sprinklersApi.onProgramsUpdate(programs => {
      programs.forEach(program => this.updateProgramFromJson(program));
    });
  }

  loadPrograms() {
    return this.managedRequest(() =>
      this.sprinklersApi.fetchPrograms()
        .map(program => Program.fromJson(this, program))
        .tap(programs => {
          this.programs = programs;
        })
        .catch(err => {
          this.alertHandler.addDangerAlert(`Failed to load programs: ${err.message}`);
        })
    );
  }

  updateProgramFromJson(json:any) {
    let program = _.find(this.programs, program => program.id === json.id);
    if (!program) {
      program = Program.fromJson(this, json);
      this.programs.push(program);
    }
    program.updateFromJson(json);
  }
}