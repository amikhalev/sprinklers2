import React from 'react/addons';
let update = React.addons.update;
let CSSTransitionGroup = React.addons.CSSTransitionGroup;
import {Alert} from 'react-bootstrap';

import alerts from '../services/alerts.js';

export default class Alerts extends React.Component {
  constructor() {
    super();
    this.listener = null;
    this.state = {
      alerts: []
    };
  }

  componentDidMount() {
    this.listener = this.add.bind(this);
    alerts.addListener('add', this.listener);
  }

  componentDidUnmount() {
    alerts.removeListener('add', this.listener);
    this.listener = null;
  }

  remove(id) {
    let i = this.state.alerts.findIndex(alert => alert.id === id);
    this.setState({
      alerts: update(this.state.alerts, {$splice: [[i, 1]]})
    });
  }

  add(type, message, timeout) {
    var id = Math.random();
    var alert = {
      id: id, type, message
    };
    this.setState({
      alerts: update(this.state.alerts, {$push: [alert]})
    });
    if (timeout === true) {
      timeout = 2.0;
    }
    if (typeof timeout === 'number') {
      setTimeout(() => this.remove(id), timeout * 1000);
    }
    return id;
  }

  renderAlert = alert => (
    <Alert key={alert.id} bsStyle={alert.type} onDismiss={this.remove.bind(this, alert.id)}>
      {alert.message}
    </Alert>
  );

  render() {
    var alertElements = this.state.alerts.map(this.renderAlert);
    return (
      <div className='alerts'>
        <CSSTransitionGroup transitionName='alerts'>
          {alertElements}
        </CSSTransitionGroup>
      </div>
    );
  }
}
