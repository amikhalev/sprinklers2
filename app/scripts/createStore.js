import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';

let logger = createLogger();

export default applyMiddleware(
  thunk, promise, logger
)(createStore);