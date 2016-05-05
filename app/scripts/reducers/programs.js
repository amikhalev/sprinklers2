import {handleActions} from 'redux-actions';
import {List, OrderedMap} from 'immutable';
import * as actionTypes from '../constants/actionTypes.js';
import mergeById from '../util/mergeById';

function fixProgram(program) {
  return {
    ...program,
    times: List(program.times)
  };
}

export default handleActions({
  [actionTypes.REQUEST_PROGRAMS]: (state) => ({
    ...state,
    isLoading: true
  }),
  [actionTypes.RECEIVE_PROGRAMS]: (state, {payload}) => ({
    isLoading: false,
    programs: mergeById(state.programs, List(payload).map(fixProgram))
  }),
  [actionTypes.RECEIVE_PROGRAM]: (state, {payload}) => ({
    ...state,
    programs: state.programs.set(payload.id, fixProgram(payload.data))
  })
}, {
  isLoading: false,
  programs: List()
});
