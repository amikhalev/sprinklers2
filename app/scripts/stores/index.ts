import GlobalStore from "./GlobalStore";
import AlertStore from "./AlertStore";
import SectionStore from "./SectionStore";
import ProgramStore from "./ProgramStore";

export {
  GlobalStore, AlertStore, SectionStore, ProgramStore
};

import SprinklersAPI from "./../util/SprinklersAPI";

export interface IStores {
  globalStore:GlobalStore,
  alertStore:AlertStore,
  sectionStore:SectionStore,
  programStore:ProgramStore
}

export function createStores(sprinklersApi:SprinklersAPI):IStores {
  const stores:IStores = {
    globalStore: new GlobalStore(),
    alertStore: new AlertStore(),
    sectionStore: new SectionStore(sprinklersApi, this.alertStore, this.globalStore),
    programStore: new ProgramStore(sprinklersApi, this.alertStore)
  };
  return stores;
}