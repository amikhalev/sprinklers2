//import 'babel-polynpm ';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import store from './store.js';
import Root from './containers/Root.jsx';
import {receivePrograms, fetchPrograms} from './actions/programs.js';
import {receiveSections, fetchSections} from './actions/sections.js';
import {SSE} from './util/sprinklersApi.js';

store.dispatch(fetchPrograms());
store.dispatch(fetchSections());

const sse = new SSE();
sse.start();
sse.on('programs', data => store.dispatch(receivePrograms(data)));
sse.on('sections', data => store.dispatch(receiveSections(data)));

ReactDOM.render((
  <Root store={store}/>
), document.getElementById('app'));
