import {createStore} from 'reflux';
import {FetchApiMixin, StateMixin} from './StoreMixins.js';
import ProgramActions from '../actions/programs.js';
import {addAlertWithTimeout} from '../actions/alerts.js';
import alertStore from './alerts.js';
import sse from '../util/sse.js';

export default createStore({
  mixins: [FetchApiMixin, StateMixin],
  isLoading: false,
  programs: [],

  init () {
    sse.on('programs', this.updatePrograms);
    this.listenToMany(ProgramActions);
  },

  getState() {
    return {
      programs: this.programs
    };
  },

  load() {
    let {onSuccess, onError} = this.fetchHandlers({
      errorMessage: 'Failed to load programs',
      action: ProgramActions.load,
      dataHandler: this.updatePrograms
    });
    fetch('/api/programs')
      .then(onSuccess, onError);
  },

  run(id) {
    let {onSuccess, onError} = this.fetchHandlers({
      errorMessage: 'Failed to run program',
      action: ProgramActions.run,
      dataHandler: this.updatePrograms
    });
    fetch(`/api/programs/${id}/run`, {
      method: 'POST'
    })
      .then(onSuccess)
      .then(data => alertStore.dispatch(addAlertWithTimeout('success', data.message, true)), onError);
  },

  updatePrograms(programs) {
    this.programs = programs;
    this.stateUpdated();
  },

  setWhen(name, when) {
    let index = this.programs.findIndex(program => program.name === name);
    this.programs[index].when = when;
    this.stateUpdated();
  }
});


