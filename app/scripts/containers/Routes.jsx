import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'

import App from './App.jsx';
import ProgramsPage from './ProgramsPage.jsx';
import SectionsPage from './SectionsPage.jsx';


let router = ({store}) => (
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      <Route component={App} path='/'>
        <Route path='sections' component={SectionsPage}/>
        <Route path='programs' component={ProgramsPage}/>
      </Route>
    </Router>
  </Provider>
);

export default router;
