import {createAction} from 'redux-actions';
import * as actionTypes from '../constants/actionTypes.js';
import * as sprinklersApi from '../util/sprinklersApi.js';
import {addAlert, addAlertWithTimeout} from './alerts.js';

export const requestSections = createAction(actionTypes.REQUEST_SECTIONS);

export const receiveSections = createAction(actionTypes.RECEIVE_SECTIONS);

export function fetchSections() {
  return dispatch => {
    dispatch(requestSections());
    let promise = sprinklersApi.fetchSections()
      .catch(error => dispatch(addAlert('danger', `Failed to fetch sections: ${error.message}`)));
    dispatch(receiveSections(promise));
  };
}

export function runSection(id, time) {
  return dispatch => sprinklersApi.runSection(id, time)
      .then(data => dispatch(addAlertWithTimeout('success', data.message)))
      .catch(error => dispatch(addAlert('danger', `Failed to run section: ${error.message}`)));
}

export const onToggleSection = createAction(actionTypes.TOGGLE_SECTION);

export function toggleSection(id) {
  return dispatch => {
    dispatch(onToggleSection);
    let promise = sprinklersApi.toggleSection(id)
      .then(res => res.data)
      .catch(error => dispatch(addAlert('danger', `Failed to toggle section: ${error.message}`)));
    dispatch(receiveSections(promise));
  }
}
