import {createAction} from 'redux-actions';
import * as actionTypes from '../constants/actionTypes.js';

let nextId = 0;

export const addAlert = createAction(actionTypes.ADD_ALERT, (style, message) => ({
  id: nextId++,
  style, message
}));

export function addPreformattedAlert(style, preformatted) {
  let html = preformatted.replace(/(?:\r\n|\r|\n)/g, '<br />');
  return addAlert(style, {
    __html: html
  });
}

export const removeAlert = createAction(actionTypes.REMOVE_ALERT);

export function addAlertWithTimeout(style, message, timeout = 2.0) {
  return dispatch => {
    let {id} = dispatch(addAlert(style, message)).payload;
    setTimeout(() => dispatch(removeAlert(id)), timeout * 1000);
  };
}