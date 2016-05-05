import React, {Component, PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import {connect} from 'react-redux';
import {Alert} from 'react-bootstrap';

import {removeAlert} from '../actions/alerts.js';

import 'styles/alerts.less';

function mapStateToProps(state) {
  return { alerts: state.alerts.alerts };
}

function mapDispatchToProps(dispatch) {
  return {
    onDismissAlert: (id) => dispatch(removeAlert(id))
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class Alerts extends Component {
  static propTypes = {
    alerts: ImmutablePropTypes.orderedMap,
    onDismissAlert: PropTypes.func
  };

  static renderMessage(message) {
    return {
      __html: message
    }
  }

  renderAlert = (alert, id) => {
    let contents;
    if (alert.message.__html) {
      contents = <span style={{display: 'inline'}} dangerouslySetInnerHTML={alert.message}/>
    } else {
      contents = alert.message;
    }
    return (
      <Alert key={id} bsStyle={alert.style} onDismiss={this.props.onDismissAlert.bind(null, id)}>
        {contents}
      </Alert>
    );
  };

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