import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import { persistState } from 'redux-devtools';

const middleware = [ thunk, promise ];

if (process.env.NODE_ENV === 'development') {
  middleware.push(createLogger());
}

const middlewareFunctions = [ applyMiddleware.apply(null, middleware) ];

if (process.env.NODE_ENV === 'development') {
  function getDebugSessionKey() {
    const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
    return (matches && matches.length > 0) ? matches[ 1 ] : null;
  }

  middlewareFunctions.push(window.devToolsExtension ? window.devToolsExtension() : f => f);
  middlewareFunctions.push(persistState(getDebugSessionKey()));
}

const finalCreateStore = compose.apply(null, middlewareFunctions)(createStore);

export default finalCreateStore;