import {combineReducers} from 'redux';

import * as reducers from './reducers';
import createStore from './createStore';

const reducer = combineReducers(reducers);
const store = createStore(reducer);

export default store;
