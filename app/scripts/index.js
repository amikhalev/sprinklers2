import 'babel/polyfill';
import 'whatwg-fetch';

import React from 'react';
import ReactDOM from 'react-dom';

import store from 'scripts/store.js';
import Root from './containers/Routes.jsx';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

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
