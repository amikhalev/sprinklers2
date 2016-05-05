import 'whatwg-fetch';

import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import store from './store';
import Root from './containers/Root';
import {receivePrograms, fetchPrograms} from './actions/programs';
import {receiveSections, fetchSections} from './actions/sections';
import {sprinklersEvents} from './webSprinklersApi';

store.dispatch(fetchPrograms());
store.dispatch(fetchSections());

sprinklersEvents.start();
sprinklersEvents.on('programs', data => store.dispatch(receivePrograms(data)));
sprinklersEvents.on('sections', data => store.dispatch(receiveSections(data)));

const rootElement = document.getElementById('app');
render((
  <AppContainer
    component={Root}
    props={{store}}/>
), rootElement);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    render((
      <AppContainer
        component={require('./containers/Root').default}
        props={{ store }}
      />
    ), rootElement);
  });
}
