import * as _ from 'lodash';
import {createAction} from 'redux-actions';
import * as actionTypes from '../constants/actionTypes.ts';
import sprinklersApi from '../webSprinklersApi';
import {addAlertWithTimeout, addPreformattedAlert} from './alerts.ts';

export const requestPrograms = createAction(actionTypes.REQUEST_PROGRAMS);

export const receivePrograms = createAction(actionTypes.RECEIVE_PROGRAMS);

export function fetchPrograms() {
  return dispatch => {
    dispatch(requestPrograms());
    sprinklersApi.fetchPrograms()
      .then(programs => dispatch(receivePrograms(programs)))
      .catch(error => dispatch(addPreformattedAlert('danger', `Failed to fetch programs: ${error.message}`)));
  };
}

export const onRunProgram = createAction(actionTypes.RUN_PROGRAM);

export function runProgram(id) {
  return dispatch => sprinklersApi.runProgram(id)
    .then(data => dispatch(addAlertWithTimeout('success', data.message)))
    .catch(error => dispatch(addPreformattedAlert('danger', `Failed to run program: ${error.message}`)))
}

export function updateProgram(id, data) {
  return dispatch => {
    sprinklersApi.updateProgram(id, _.omit(data, [ 'running' ]))
      .then(res => {
        dispatch(receivePrograms(res.data));
      })
      .catch(error => dispatch(addPreformattedAlert('danger', `Failed to update program: ${error.message}`)));
  }
}
