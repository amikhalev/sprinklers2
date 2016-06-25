import 'whatwg-fetch';

import * as React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Root from './containers/Root';

import sprinklersApi from './webSprinklersApi';
import {IStores, createStores} from './stores/index';

const stores = createStores(sprinklersApi);

stores.sectionStore.loadSections();
stores.programStore.loadPrograms();

sprinklersApi.startEvents();

const rootElement = document.getElementById('app');
render((
  <AppContainer
    component={Root}
    props={stores}/>
), rootElement);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    render((
      <AppContainer
        component={require('./containers/Root').default}
        props={stores}
      />
    ), rootElement);
  });
}
