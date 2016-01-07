import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Input, Button} from 'react-bootstrap';

export default class RunSectionForm extends React.Component {
  static propTypes = {
    sections: ImmutablePropTypes.list.isRequired,
    runSection: PropTypes.func.isRequired
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
    let {runSection} = this.props;
    e.preventDefault();
    runSection(section, time);
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