import {observable, computed} from 'mobx';
import * as _ from 'lodash';
import Section from '../models/Section';
import SprinklersAPI from '../util/SprinklersAPI';
import AlertHandler from "../util/AlertHandler";
import GlobalStore from "./GlobalStore";
import APIStore from "./APIStore";

/**
 * The store for all @{link Section}s and information related to sections
 */
export default class SectionStore extends APIStore {
  /**
   * The object to use for sending alerts
   */
  alertHandler:AlertHandler;

  /**
   * The global store
   */
  globalStore:GlobalStore;

  /**
   * The list of all sections
   * @type {Array<SectionView>}
   */
  @observable sections:Array<Section> = [];

  /**
   * Creates a new SectionStore with no sections
   * @param sprinklersApi {SprinklersAPI} The api instance to use
   * @param alertHandler {AlertHandler} The alert handler to send alerts to
   * @param globalStore {GlobalStore} The global store
   */
  constructor(sprinklersApi:SprinklersAPI, alertHandler:AlertHandler, globalStore:GlobalStore) {
    super(sprinklersApi);
    this.alertHandler = alertHandler;
    this.globalStore = globalStore;

    this.sprinklersApi.onSectionsUpdate(sections => {
      sections.forEach(section => this.updateSectionFromJson(section));
    });
  }

  /**
   * Loads sections from the server
   * @returns {Promise}
   */
  loadSections():Promise<Array<Section>> {
    return this.managedRequest(() =>
      this.sprinklersApi.fetchSections()
        .map(section => Section.fromJson(this, section) as Section)
        .tap(sections => {
          this.sections = sections;
        })
        .catch(err => {
          this.alertHandler.addDangerAlert(`Failed to load sections: ${err.message}`)
        })
    );
  }

  /**
   * Updates the section from json received from the server
   * @param json {*} The data to update the section with
   */
  updateSectionFromJson(json:any) {
    let section = _.find(this.sections, section => section.id === json.id);
    if (!section) {
      section = Section.fromJson(this, json);
      this.sections.push(section);
    }
    section.updateFromJson(json);
  }
}