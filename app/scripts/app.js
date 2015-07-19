import 'babel/polyfill';

import React from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';

import Alerts from './components/Alerts.jsx';
import Sections from './components/Sections.jsx';
import RunSectionForm from './components/RunSectionForm.jsx';
import RunProgramForm from './components/RunProgramForm.jsx';
import Programs from './components/Programs.jsx';

import SectionStore from './stores/SectionStore.js';
import ProgramStore from './stores/ProgramStore.js';

SectionStore.load();
ProgramStore.load();

function getAppState() {
  return {
    sections: SectionStore.sections,
    isLoadingSections: SectionStore.isLoading,
    programs: ProgramStore.programs,
    isLoadingPrograms: ProgramStore.isLoading
  };
}

class App extends React.Component {
  constructor() {
    super();
    this.state = getAppState();
    this._handleChange = this._handleChange.bind(this);
  }

  componentDidMount() {
    SectionStore.addChangeListener(this._handleChange);
    ProgramStore.addChangeListener(this._handleChange);
  }

  componentDidUnmount() {
    SectionStore.removeChangeListener(this._handleChange);
    ProgramStore.removeChangeListener(this._handleChange);
  }

  _handleChange() {
    this.setState(getAppState());
  }

  render() {
    return (
      <div>
        <h1 id='title'>Sprinklers Control Panel</h1>
        <Alerts/>
        <ListGroup>
          <ListGroupItem>
            <Sections sections={this.state.sections}
                      loading={this.state.isLoadingSections}/>
          </ListGroupItem>
          <ListGroupItem>
            <RunSectionForm sections={this.state.sections}/>
          </ListGroupItem>
          <ListGroupItem>
            <Programs programs={this.state.programs}/>
          </ListGroupItem>
          <ListGroupItem>
            <RunProgramForm programs={this.state.programs}/>
          </ListGroupItem>
        </ListGroup>
      </div>
    );
  }
}

React.render(<App/>, document.getElementById('app'));
