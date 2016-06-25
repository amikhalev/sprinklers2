import {handleActions, Action} from 'redux-actions';
import {List, OrderedMap} from 'immutable';
import * as actionTypes from '../constants/actionTypes';
import mergeById from '../util/mergeById';
import * as _ from 'lodash';

function fixProgram(program) {
  return _.assign({}, program, {
    times: List(program.times)
  }) as any;
}

export interface State {
  isLoading: boolean,
  programs: List<any>
}

export default handleActions<State>({
  [actionTypes.REQUEST_PROGRAMS]: (state:State, action:Action<any>) => ({
    isLoading: true,
    programs: state.programs
  }),
  [actionTypes.RECEIVE_PROGRAMS]: (state:State, {payload}: Action<any>) => ({
    isLoading: false,
    programs: mergeById(state.programs, List(payload).map(fixProgram).toList())
  }),
  [actionTypes.RECEIVE_PROGRAM]: (state:State, {payload}: Action<any>) => ({
    isLoading: false,
    programs: state.programs.set(payload.id, fixProgram(payload.data))
  })
}, {
  isLoading: false,
  programs: List()
});
