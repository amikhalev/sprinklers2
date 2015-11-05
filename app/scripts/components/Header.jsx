import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Nav, NavItem} from 'react-bootstrap';

export default class Header extends React.Component {
  static propTypes = {
    history: PropTypes.any.isRequired,
    navigation: ImmutablePropTypes.orderedMapOf(PropTypes.string).isRequired
  };

  renderNavItem = (title, path) => {
    const {history} = this.props;
    return (
      <NavItem key={path} active={history.isActive(path)} href={history.createHref(path)}>{title}</NavItem>
    );
  };

  render() {
    const {navigation, history} = this.props;
    let navItems = navigation.map(this.renderNavItem).toArray();
    return (
      <div className='header clearfix'>
        <Nav bsStyle='pills' pullRight>
          {navItems}
        </Nav>

        <h3 className='text-muted'><a href={history.createHref('/')}>Sprinklers Control Panel</a></h3>
      </div>
    );
  }
}
