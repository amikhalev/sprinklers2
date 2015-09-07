import 'babel/polyfill';

import React from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import Router, {Route, RouteHandler} from 'react-router';

import {load as loadPrograms} from './actions/ProgramActions.js';
import {load as loadSections} from './actions/SectionActions.js';

import Alerts from './components/Alerts.jsx';

import ProgramsPage from './pages/ProgramsPage.jsx';
import SectionsPage from './pages/SectionsPage.jsx';

loadPrograms();
loadSections();

let App = React.createClass({
  mixins: [Router.Navigation, Router.State],

  renderNavItem(path, title) {
    return (
      <NavItem active={this.isActive(path)} href={this.makeHref(path)}>{title}</NavItem>
    );
  },

  render() {
    return (
      <div>
        <div className='header clearfix'>
          <Nav bsStyle='pills' pullRight>
            {this.renderNavItem('sections', 'Sections')}
            {this.renderNavItem('programs', 'Programs')}
          </Nav>

          <h3 className='text-muted'><a href={this.makeHref('/')}>Sprinklers Control Panel</a></h3>
        </div>
        <Alerts/>
        <RouteHandler/>
      </div>
    );
  }
});

let routes = (
  <Route handler={App} path='/'>
    <Route name='sections' handler={SectionsPage}/>
    <Route name='programs' handler={ProgramsPage}/>
  </Route>
);

Router.run(routes, (Root) => {
  React.render(<Root/>, document.getElementById('app'));
});
