import {EventEmitter} from 'events';
import $ from 'jquery';
import sse from '../services/sse.js';
import alerts from '../services/alerts.js';

function errorHandler(message) {
  return (xhr) => {
    let response = JSON.parse(xhr.responseText);
    alerts.add('danger', `${message}: ${response.message}`);
  };
}

class ProgramStore extends EventEmitter {
  constructor() {
    super();
    this.isLoading = false;
    this.programs = [];
    this._updatePrograms = this._updatePrograms.bind(this);
    sse.on('programs', this._updatePrograms);
  }

  load() {
    this._startLoading();
    $.getJSON('/api/programs')
      .success(this._updatePrograms)
      .fail(errorHandler('Failed to load programs'));
  }

  toggle(id) {
    this._startLoading();
    $.post(`/api/programs/${id}/toggle`, {
      dataType: 'json'
    })
      .success(this._updatePrograms)
      .fail(errorHandler('Failed to toggle programs'));
  }

  run(id) {
    this._startLoading();
    $.ajax(`/api/programs/${id}/run`, {
      method: 'POST',
      dataType: 'json'
    })
      .success(data => {
        alerts.add('success', data.message, true);
        this._updatePrograms(data);
      })
      .fail(errorHandler('Failed to run program'));
  }

  _startLoading() {
    this.isLoading = true;
    this.emitChange();
  }

  _updatePrograms(response) {
    this.programs = response.data;
    this.isLoading = false;
    this.emitChange();
  }

  emitChange() {
    this.emit('change');
  }

  addChangeListener(listener) {
    this.addListener('change', listener);
  }

  removeChangeListener(listener) {
    this.removeListener('change', listener);
  }
}

export default new ProgramStore();
