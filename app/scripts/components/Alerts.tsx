import * as React from 'react';
const CSSTransitionGroup = require('react-addons-css-transition-group');
import {observer} from 'mobx-react';
import {Alert} from 'react-bootstrap';

import 'styles/alerts.less';
import AlertStore from "../stores/AlertStore";

export interface IAlertsProps {
  alertStore:AlertStore;
}

@observer
class Alerts extends React.Component<IAlertsProps, void> {
  static renderMessage(message) {
    return {
      __html: message
    }
  }

  renderAlert = (alert) => {
    let contents;
    if (alert.contents.__html) {
      contents = <span style={{display: 'inline'}} dangerouslySetInnerHTML={alert.contents}/>
    } else {
      contents = alert.contents;
    }
    return (
      <Alert key={alert.id} bsStyle={alert.style} onDismiss={() => alert.remove()}>
        {contents}
      </Alert>
    );
  };

  render() {
    const {alertStore} = this.props;
    return (
      <div className='alerts'>
        <CSSTransitionGroup transitionName='alerts' transitionEnterTimeout={500} transitionLeaveTimeout={500}>
          {alertStore.alerts.map(this.renderAlert)}
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default Alerts;