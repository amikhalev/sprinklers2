import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import alerts from '../reducers/alerts';

const finalCreateStore = applyMiddleware(
  thunk
)(createStore);

export default finalCreateStore(alerts);


