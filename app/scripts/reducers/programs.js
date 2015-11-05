import {handleActions} from 'redux-actions';
import {List, OrderedMap} from 'immutable';
import * as actionTypes from '../constants/actionTypes.js';

export default handleActions({
  [actionTypes.REQUEST_PROGRAMS]: (state) => ({
    ...state,
    isLoading: true
  }),
  [actionTypes.RECEIVE_PROGRAMS]: (state, {payload}) => ({
    isLoading: false,
    programs: List(payload).map(program => ({
      ...program,
      times: List(program.times.map((time, section) => ({ time, section }))) // this should be changed on the server eventually...
    }))
  }),
  [actionTypes.UPDATE_PROGRAM]: (state, {payload}) => ({
    ...state,
    programs: state.programs.set(payload.id, payload.data)
  })
}, {
  isLoading: false,
  programs: List()
});
