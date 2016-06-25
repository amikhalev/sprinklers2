import {createStore, compose, applyMiddleware} from 'redux';
const thunk = require('redux-thunk');
const promise = require('redux-promise');
const createLogger = require('redux-logger');

const middleware = [ thunk, promise ];

if (process.env.NODE_ENV === 'development') {
  middleware.push(createLogger());
}

const middlewareFunctions = [ applyMiddleware.apply(null, middleware) ];

if (process.env.NODE_ENV === 'development') {
  if (window.devToolsExtension) {
    middlewareFunctions.push(window.devToolsExtension());
  }
}

const finalCreateStore = compose.apply(null, middlewareFunctions)(createStore);

export default finalCreateStore;