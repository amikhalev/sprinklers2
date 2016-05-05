import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {List} from 'immutable';
import {Input, Button} from 'react-bootstrap';

export default class RunProgramForm extends React.Component {
  static propTypes = {
    programs: ImmutablePropTypes.list.isRequired,
    onRunProgramClick: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      program: 1
    };
  }

  onChangeProgram = (e) => {
    this.setState({
      program: e.target.value
    });
  };

  run = (e) => {
    this.props.onRunProgramClick(this.state.program);
    e.preventDefault();
  };

  render() {
    let {program} = this.state;
    let programs = this.props.programs.map((program) => (
      <option key={program.id} value={program.id}>{program.name}</option>
    ));
    return (
      <div>
        <h2>Run program</h2>

        <form>
          <Input type='select' label='Program' placeholder='Choose a program' value={program}
                 onChange={this.onChangeProgram}>
            {programs}
          </Input>
          <Button onClick={this.run}>Run</Button>
        </form>
      </div>
    );
  }
}
