import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import { persistState } from 'redux-devtools';
import DevTools from './containers/DevTools.jsx';

const middleware = [ thunk, promise ];

if (__DEBUG__) {
  middleware.push(createLogger());
}

const middlewareFunctions = [ applyMiddleware.apply(null, middleware) ];

if (__DEBUG__) {
  function getDebugSessionKey() {
    const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
    return (matches && matches.length > 0) ? matches[ 1 ] : null;
  }

  middlewareFunctions.push(DevTools.instrument());
  middlewareFunctions.push(persistState(getDebugSessionKey()));
}

const finalCreateStore = compose.apply(null, middlewareFunctions)(createStore);

export default finalCreateStore;