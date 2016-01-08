import React from 'react';
import {Provider} from 'react-redux';
import {Router, Route, browserHistory} from 'react-router';

import App from './App.jsx';
import ProgramsPage from './ProgramsPage.jsx';
import SectionsPage from './SectionsPage.jsx';


let router = ({store}) => (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route component={App} path='/'>
        <Route path='sections' component={SectionsPage}/>
        <Route path='programs' component={ProgramsPage}/>
      </Route>
    </Router>
  </Provider>
);

export default router;
