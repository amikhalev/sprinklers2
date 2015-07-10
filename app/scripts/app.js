import 'babel/polyfill';

import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

import Alerts from './components/alerts.jsx';
import SectionStates from './components/sectionStates.jsx';
import RunSectionForm from './components/runSectionForm.jsx';
import RunProgramForm from './components/runProgramForm.jsx';
import Programs from './components/programs.jsx';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1 id='title'>Sprinklers Control Panel</h1>
        <Alerts/>
        <ListGroup>
          <ListGroupItem><SectionStates/></ListGroupItem>
          <ListGroupItem><RunSectionForm/></ListGroupItem>
          <ListGroupItem><RunProgramForm/></ListGroupItem>
          <ListGroupItem><Programs/></ListGroupItem>
        </ListGroup>
      </div>
    );
  }
}

React.render(<App/>, document.getElementById('app'));
