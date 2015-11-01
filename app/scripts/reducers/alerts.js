import {ADD_ALERT, REMOVE_ALERT} from '../constants.js';
import {OrderedMap} from 'immutable';

export default function (state = OrderedMap(), action = undefined) {
  switch (action.type) {
    case ADD_ALERT: {
      let {id, style, message} = action;
      let alert = { style, message };
      return state.set(id, alert);
    }
    case REMOVE_ALERT: {
      let {id} = action;
      return state.delete(id);
    }
  }
  return state;
}
