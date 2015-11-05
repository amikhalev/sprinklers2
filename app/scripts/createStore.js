import {compose, createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import { devTools, persistState } from 'redux-devtools';

let middleware = [thunk, promise];

if (__DEBUG__) {
  middleware.push(createLogger());
}

let middlewareFunctions = [applyMiddleware.apply(null, middleware)];

if (__DEBUG__) {
  middlewareFunctions.push(devTools());
  middlewareFunctions.push(persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)));
}

export default compose.apply(null, middlewareFunctions)(createStore);