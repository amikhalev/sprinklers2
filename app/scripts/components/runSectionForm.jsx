import React, {PropTypes} from 'react';
import {Input, Button} from 'react-bootstrap';
import {run as runSection} from '../actions/sections.js';

export default class RunSectionForm extends React.Component {
  static propTypes = {
    sections: PropTypes.array
  };

  static defaultProps = {
    sections: []
  };

  constructor() {
    super();
    this.state = {
      section: 0,
      time: ''
    };
  }

  onChangeSection = (e) => {
    this.setState({
      section: e.target.value
    });
  };

  onChangeTime = (e) => {
    this.setState({
      time: e.target.value
    });
  };

  run = (e) => {
    let {section, time} = this.state;
    runSection(section, time);
    e.preventDefault();
  };

  render() {
    let sections = this.props.sections.map((section, i) => (
      <option key={section.name} value={i}>{section.name}</option>
    ));
    let {section, time} = this.state;
    return (
      <div>
        <h2>Run section</h2>

        <form onSubmit={this.run}>
          <Input type='select' label='Section' placeholder='Choose a section' value={section}
                 onChange={this.onChangeSection}>
            {sections}
          </Input>
          <Input type='number' label='Time (seconds)' min='0' max='3600' required value={time}
                 onChange={this.onChangeTime}/>
          <Button type='submit'>Run</Button>
        </form>
      </div>
    );
  }
}
