import React, {Component, PropTypes} from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';
import {Alert} from 'react-bootstrap';

import {removeAlert} from '../actions/alerts.js';

import 'styles/alerts.less';

function mapStateToProps(alerts) {
  return {alerts};
}

function mapDispatchToProps(dispatch) {
  return {
    onDismissAlert: (id) => dispatch(removeAlert(id))
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class Alerts extends Component {
  static propTypes = {
    alerts: PropTypes.object,
    onDismissAlert: PropTypes.func
  };

  renderAlert = (alert, id) => (
    <Alert key={id} bsStyle={alert.style} onDismiss={this.props.onDismissAlert.bind(null, id)}>
      {alert.message}
    </Alert>
  );

  render() {
    return (
      <div className='alerts'>
        <CSSTransitionGroup transitionName='alerts' transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {this.props.alerts.map(this.renderAlert).toArray()}
        </CSSTransitionGroup>
      </div>
    );
  }
}


export default Alerts;