//import 'babel-polynpm ';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import store from './store.js';
import Root from './containers/Routes.jsx';
import {receivePrograms} from './actions/programs.js';
import {receiveSections} from './actions/sections.js';
import {SSE} from './util/sprinklersApi.js';

let sse = new SSE();
sse.start();
sse.on('programs', data => store.dispatch(receivePrograms(data)));
sse.on('sections', data => store.dispatch(receiveSections(data)));

let debugPanel;

if (__DEBUG__) {
  debugPanel = (
    <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel>
  );
}

ReactDOM.render((
  <div>
    <Root store={store}/>
    {debugPanel}
  </div>
), document.getElementById('app'));
