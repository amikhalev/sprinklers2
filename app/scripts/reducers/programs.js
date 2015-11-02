import {handleActions} from 'redux-actions';
import {List} from 'immutable';
import * as actionTypes from '../constants/actionTypes.js';

export default handleActions({
  [actionTypes.FETCH_PROGRAMS]: (state) => ({
    ...state,
    isLoading: true
  }),
  [actionTypes.FETCHED_PROGRAMS]: (state, {payload}) => ({
    isLoading: false,
    programs: List(payload)
  })
}, {
  isLoading: false,
  programs: List()
});
