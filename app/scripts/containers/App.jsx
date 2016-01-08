import React, {PropTypes} from 'react';

import Header from '../components/Header.jsx';
import Alerts from '../components/Alerts.jsx';
import navigation from '../constants/navigation.js';

import 'styles/app.less';

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    history: PropTypes.any.isRequired
  };

  render() {
    return (
      <div>
        <Header history={this.props.history} navigation={navigation} />
        <Alerts />
        {this.props.children}
      </div>
    );
  }
}
