import {createAction} from 'redux-actions';
import * as actionTypes from '../constants/actionTypes.js';
import {sprinklersApi} from '../webSprinklersApi';
import {addPreformattedAlert, addAlertWithTimeout} from './alerts.js';

export const requestSections = createAction(actionTypes.REQUEST_SECTIONS);

export const receiveSections = createAction(actionTypes.RECEIVE_SECTIONS);

export function fetchSections() {
  return dispatch => {
    dispatch(requestSections());
    sprinklersApi.fetchSections()
      .then(sections => dispatch(receiveSections(sections)))
      .catch(error => dispatch(addPreformattedAlert('danger', `Failed to fetch sections: ${error.message}`)));
  };
}

export function runSection(id, time) {
  return dispatch => sprinklersApi.runSection(id, time)
    .then(data => dispatch(addAlertWithTimeout('success', data.message)))
    .catch(error => dispatch(addPreformattedAlert('danger', `Failed to run section: ${error.message}`)));
}

export const onToggleSection = createAction(actionTypes.TOGGLE_SECTION);

export function toggleSection(id) {
  return dispatch => {
    dispatch(onToggleSection);
    let promise = sprinklersApi.toggleSection(id)
      .then(res => dispatch(receiveSections(res.data)))
      .catch(error => dispatch(addPreformattedAlert('danger', `Failed to toggle section: ${error.message}`)));
  }
}
