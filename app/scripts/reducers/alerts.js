import {handleActions} from 'redux-actions';
import {OrderedMap} from 'immutable';
import * as actionTypes from '../constants/actionTypes.js';

export default handleActions({
  [actionTypes.ADD_ALERT]: ({alerts}, {payload}) => {
    let {id, ...alert} = payload;
    return { alerts: alerts.set(id, alert) };
  },
  [actionTypes.REMOVE_ALERT]: ({alerts}, {payload}) => {
    return { alerts: alerts.delete(payload) };
  }
}, {
  alerts: OrderedMap()
});
