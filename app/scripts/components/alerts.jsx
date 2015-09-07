import React from 'react/addons';
const CSSTransitionGroup = React.addons.CSSTransitionGroup;
import {Alert} from 'react-bootstrap';
import {connect as connectToStore} from 'reflux';

import AlertStore from '../stores/AlertStore.js';
import {remove as removeAlert} from '../actions/AlertActions.js';

export default React.createClass({
  mixins: [connectToStore(AlertStore)],

  renderAlert: (alert, id) => (
    <Alert key={id} bsStyle={alert.type} onDismiss={removeAlert.bind(null, id)}>
      {alert.message}
    </Alert>
  ),

  render() {
    return (
      <div className='alerts'>
        <CSSTransitionGroup transitionName='alerts'>
          {this.state.alerts.map(this.renderAlert).toArray()}
        </CSSTransitionGroup>
      </div>
    );
  }
});
