import React, {PropTypes} from 'react';
import {Input, Button} from 'react-bootstrap';
import ProgramStore from '../stores/ProgramStore.js';

export default class RunProgramForm extends React.Component {
  static propTypes = {
    programs: PropTypes.array
  };

  static defaultProps = {
    programs: []
  };

  run(e) {
    let program = this.refs.program.getValue();
    ProgramStore.run(program);
    e.preventDefault();
  }

  render() {
    let programs = this.props.programs.map((program, i) => (
      <option key={program.name} value={i}>{program.name}</option>
    ));
    return (
      <div>
        <h2>Run program</h2>

        <form>
          <Input type='select' label='Program' placeholder='Choose a program' ref='program'>
            {programs}
          </Input>
          <Button onClick={this.run.bind(this)}>Run</Button>
        </form>
      </div>
    );
  }
}
