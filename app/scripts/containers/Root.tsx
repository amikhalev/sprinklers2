import * as React from 'react';
import {Router, Route, browserHistory} from 'react-router';
import {IStores} from "../stores/index";
const createBrowserHistory = require('history/lib/createBrowserHistory');
import wrapComponent from '../util/wrapComponent';

import App from './App';
import ProgramsPage from './ProgramsPage';
import SectionsPage from './SectionsPage';

const Root:React.SFC<IStores> = (stores:IStores) => (
  <Router history={createBrowserHistory()}>
    <Route path='/' component={wrapComponent(App, stores)}>
      <Route path='sections' component={wrapComponent(SectionsPage, stores)}/>
      <Route path='programs' component={wrapComponent(ProgramsPage, stores)}/>
    </Route>
  </Router>
);

export default Root;