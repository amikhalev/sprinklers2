import * as React from 'react';
import AlertStore from "../stores/AlertStore";

import Header from '../components/Header';
import Alerts from '../components/Alerts';
import navigation from '../constants/navigation';
import {IStores} from "../stores/index";

import 'styles/app.less';

export interface IAppProps extends IStores {
  children: any,
  history: HistoryModule.History
}

export default class App extends React.Component<IAppProps, void> {
  render() {
    return (
      <div>
        <Header history={this.props.history} navigation={navigation} />
        <Alerts alertStore={this.props.alertStore} />
        {this.props.children}
      </div>
    );
  }
}
