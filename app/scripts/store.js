import {combineReducers} from 'redux';

import * as reducers from './reducers';
import createStore from './createStore.js';
import {fetchPrograms} from './actions/programs.js';
import {fetchSections} from './actions/sections.js';

const reducer = combineReducers(reducers);
const store = createStore(reducer);

store.dispatch(fetchPrograms());
store.dispatch(fetchSections());

export default store;
