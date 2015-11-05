import {handleActions} from 'redux-actions';
import {List} from 'immutable';
import * as actionTypes from '../constants/actionTypes.js';

export default handleActions({
  [actionTypes.REQUEST_SECTIONS]: (state) => ({
    ...state,
    isLoading: true
  }),
  [actionTypes.RECEIVE_SECTIONS]: (state, {payload}) => ({
    isLoading: false,
    sections: List(payload)
  })
}, {
  isLoading: false,
  sections: List()
});
