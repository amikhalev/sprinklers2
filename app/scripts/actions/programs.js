import {createAction} from 'redux-actions';
import * as actionTypes from '../constants/actionTypes.js';
import {addAlertWithTimeout} from './alerts.js';
import alertStore from '../stores/alerts.js';
import * as sprinklersApi from '../util/sprinklersApi.js';

export const onFetchPrograms = createAction(actionTypes.FETCH_PROGRAMS);

export const fetchedPrograms = createAction(actionTypes.FETCHED_PROGRAMS);

export function fetchPrograms() {
  return dispatch => {
    dispatch(onFetchPrograms());
    let promise = sprinklersApi.fetchPrograms()
      .then(res => res.data);
    dispatch(fetchedPrograms(promise));
  };
}

export const runProgram = createAction(actionTypes.RUN_PROGRAM, (id) =>
    sprinklersApi.runProgram(id)
      .then(data => alertStore.dispatch(addAlertWithTimeout('success', data.message)))
);
