import 'babel/polyfill';
import 'whatwg-fetch';

import React, {PropTypes} from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import {Router, Route} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'

import Alerts from '../components/Alerts.jsx';
import ProgramsPage from './ProgramsPage.jsx';
import SectionsPage from './SectionsPage.jsx';
import alertStore from '../stores/alerts.js';
import programStore from '../stores/programs.js';

import 'styles/app.less';

class App extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.object
  };

  renderNavItem(path, title) {
    const {history} = this.props;
    return (
      <NavItem active={history.isActive(path)} href={history.createHref(path)}>{title}</NavItem>
    );
  }

  render() {
    const {children, history} = this.props;
    return (
      <div>
        <div className='header clearfix'>
          <Nav bsStyle='pills' pullRight>
            {this.renderNavItem('/sections', 'Sections')}
            {this.renderNavItem('/programs', 'Programs')}
          </Nav>

          <h3 className='text-muted'><a href={history.createHref('/')}>Sprinklers Control Panel</a></h3>
        </div>
        <Alerts store={alertStore}/>
        {children}
      </div>
    );
  }
}

let router = (
  <Router history={createBrowserHistory()}>
    <Route component={App} path='/'>
      <Route path='sections' component={SectionsPage}/>
      <Route path='programs' component={() => <ProgramsPage store={programStore} />}/>
    </Route>
  </Router>
);

export default router;
