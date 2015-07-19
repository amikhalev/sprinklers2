import React, {PropTypes} from 'react';
import {Input, Button} from 'react-bootstrap';
import SectionStore from '../stores/SectionStore.js';

export default class RunSectionForm extends React.Component {
  static propTypes = {
    sections: PropTypes.array
  };

  static defaultProps = {
    sections: []
  };

  run(e) {
    let section = this.refs.section.getValue();
    let time = this.refs.time.getValue();
    SectionStore.run(section, time);
    e.preventDefault();
  }

  render() {
    let sections = this.props.sections.map((section, i) => (
      <option key={section.name} value={i}>{section.name}</option>
    ));
    return (
      <div>
        <h2>Run section</h2>

        <form>
          <Input type='select' label='Section' placeholder='Choose a section' ref='section'>
            {sections}
          </Input>
          <Input type='number' label='Time (seconds)' min='0' max='3600' ref='time' required/>
          <Button onClick={this.run.bind(this)}>Run</Button>
        </form>
      </div>
    );
  }
}
