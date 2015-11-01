import {ADD_ALERT, REMOVE_ALERT} from '../constants.js';

let nextId = 0;

export function addAlert(style, message) {
  return {
    type: ADD_ALERT,
    id: nextId++,
    style, message
  };
}

export function removeAlert(id) {
  return {
    type: REMOVE_ALERT,
    id
  };
}

export function addAlertWithTimeout(style, message, timeout = 2.0) {
  return dispatch => {
    let {id} = dispatch(addAlert(style, message));
    setTimeout(() => dispatch(removeAlert(id)), timeout * 1000);
  };
}

//window.onerror = function(msg, url, line, col) {
//  AlertActions.add('danger', `Uncaught Exception (${url}:${line}:${col}):\n${msg}`);
//};