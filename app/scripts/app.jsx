import 'babel/polyfill';
import 'whatwg-fetch';

import React, {PropTypes} from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import {Router, Route} from 'react-router';

import {load as loadPrograms} from './actions/ProgramActions.js';
import {load as loadSections} from './actions/SectionActions.js';

import Alerts from './components/Alerts.jsx';

import ProgramsPage from './pages/ProgramsPage.jsx';
import SectionsPage from './pages/SectionsPage.jsx';

loadPrograms();
loadSections();

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
            {this.renderNavItem('sections', 'Sections')}
            {this.renderNavItem('programs', 'Programs')}
          </Nav>

          <h3 className='text-muted'><a href={history.createHref('/')}>Sprinklers Control Panel</a></h3>
        </div>
        <Alerts/>
        {children}
      </div>
    );
  }
}

React.render((
  <Router>
    <Route component={App} path='/'>
      <Route path='sections' component={SectionsPage}/>
      <Route path='programs' component={ProgramsPage}/>
    </Route>
  </Router>
), document.getElementById('app'));
