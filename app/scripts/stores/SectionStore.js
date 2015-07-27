import {EventEmitter} from 'events';
import $ from 'jquery';
import sse from '../services/sse.js';
import alerts from '../services/alerts.js';

function errorHandler(message) {
  return (xhr) => {
    let error;
    if (xhr.status === 500) {
      error = 'Internal Server Error';
    } else {
      let response = JSON.parse(xhr.responseText);
      error = response.message;
    }
    alerts.add('danger', `${message}: ${error}`);
  };
}

class SectionStore extends EventEmitter {
  constructor() {
    super();
    this.isLoading = false;
    this.sections = [];
    this._updateSections = this._updateSections.bind(this);
    sse.on('sections', this._updateSections);
  }

  load() {
    this._startLoading();
    $.getJSON('/api/sections')
      .success(this._updateSections)
      .fail(errorHandler('Failed to load sections'));
  }

  toggle(id) {
    this._startLoading();
    $.post(`/api/sections/${id}/toggle`, {
      dataType: 'json'
    })
      .success(this._updateSections)
      .fail(errorHandler('Failed to toggle section'));
  }

  run(id, time) {
    this._startLoading();
    $.ajax(`/api/sections/${id}/run`, {
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        time
      }),
      dataType: 'json'
    })
      .success(data => {
        alerts.add('success', data.message, true);
        this._updateSections(data);
      })
      .fail(errorHandler('Failed to run section'));
  }

  _startLoading() {
    this.isLoading = true;
    this.emitChange();
  }

  _updateSections(response) {
    this.sections = response.data;
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

export default new SectionStore();
