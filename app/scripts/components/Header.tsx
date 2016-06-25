import * as React from 'react';
import {Nav, NavItem} from 'react-bootstrap';
import {Link} from 'react-router';
import {OrderedMap} from 'immutable';

export interface IHeaderProps {
  history: HistoryModule.History & any,
  navigation: OrderedMap<string, string>
}

export default class Header extends React.Component<IHeaderProps, void> {
  renderNavItem = (title, path) => {
    let active = this.props.history.isActive(path);
    return (
      <li key={path} className={active ? 'active' : ''}>
        <Link to={path}>
          {title}
        </Link>
      </li>
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

        <h3 className='text-muted'><Link to={'/'}>Sprinklers Control Panel</Link></h3>
      </div>
    );
  }
}
