import React from 'react';
import {Router, Route, browserHistory} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'

import App from './App.jsx';
import ProgramsPage from './ProgramsPage.jsx';
import SectionsPage from './SectionsPage.jsx';

const routes = (
  <Router history={createBrowserHistory()}>
    <Route path='/' component={App}>
      <Route path='sections' component={SectionsPage}/>
      <Route path='programs' component={ProgramsPage}/>
    </Route>
  </Router>
);

export default routes;