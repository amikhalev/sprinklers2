import {createAction} from 'redux-actions';
import * as actionTypes from '../constants/actionTypes.js';
import * as sprinklersApi from '../util/sprinklersApi.js';
import {addAlertWithTimeout, addAlert} from './alerts.js';

export const requestPrograms = createAction(actionTypes.REQUEST_PROGRAMS);

export const receivePrograms = createAction(actionTypes.RECEIVE_PROGRAMS);

export function fetchPrograms() {
  return dispatch => {
    dispatch(requestPrograms());
    dispatch(receivePrograms(sprinklersApi.fetchPrograms()));
  };
}

export const updateProgram = createAction(actionTypes.UPDATE_PROGRAM, (id, data) => ({ id, data }));

export const onRunProgram = createAction(actionTypes.RUN_PROGRAM);

export function runProgram(id) {
  return dispatch => sprinklersApi.runProgram(id)
    .then(data => dispatch(addAlertWithTimeout('success', data.message)))
    .catch(error => dispatch(addAlert('danger', `Failed to run program: ${error.message}`)))
}
