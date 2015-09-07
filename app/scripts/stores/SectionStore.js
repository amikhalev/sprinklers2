import {createStore} from 'reflux';
import {FetchApiMixin, StateMixin} from './StoreMixins.js';
import {add as addAlert} from '../actions/AlertActions.js';
import SectionActions from '../actions/SectionActions.js';
import sse from '../services/sse.js';

export default createStore({
  mixins: [FetchApiMixin, StateMixin],
  isLoading: false,
  sections: [],

  init() {
    sse.on('sections', this.updateSections);
    this.listenToMany(SectionActions);
  },

  getState() {
    return {
      sections: this.sections
    };
  },

  load() {
    let {onSuccess, onError} = this.fetchHandlers({
      errorMessage: 'Failed to load sections',
      action: SectionActions.load,
      dataHandler: this.updateSections
    });
    fetch('/api/sections')
      .then(onSuccess, onError);
  },

  toggle(id) {
    let {onSuccess, onError} = this.fetchHandlers({
      errorMessage: 'Failed to toggle sections',
      action: SectionActions.toggle,
      dataHandler: this.updateSections
    });
    fetch(`/api/sections/${id}/toggle`, {
      method: 'POST'
    })
      .then(onSuccess, onError);
  },

  run(id, time) {
    let {onSuccess, onError} = this.fetchHandlers({
      errorMessage: 'Failed to run section',
      action: SectionActions.run,
      dataHandler: this.updateSections
    });
    fetch(`/api/sections/${id}/run`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        time
      })
    })
      .then(onSuccess)
      .then(data => addAlert('success', data.message, true), onError);
  },

  updateSections(sections) {
    this.sections = sections;
    this.stateUpdated();
  }
});

