import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {List} from 'immutable';
import {Input, Button} from 'react-bootstrap';

export default class RunProgramForm extends React.Component {
  static propTypes = {
    programs: ImmutablePropTypes.list.isRequired,
    runProgram: PropTypes.func.isRequired
  };

  static defaultProps = {
    programs: List()
  };

  constructor() {
    super();
    this.state = {
      program: 0
    };
  }

  onChangeProgram(e) {
    this.setState({
      program: e.target.value
    });
  }

  run(e) {
    let {program} = this.state;
    let {runProgram} = this.props;
    runProgram(program);
    e.preventDefault();
  }

  render() {
    let {program} = this.state;
    let programs = this.props.programs.map((program, i) => (
      <option key={program.name} value={i}>{program.name}</option>
    ));
    return (
      <div>
        <h2>Run program</h2>

        <form>
          <Input type='select' label='Program' placeholder='Choose a program' value={program}
                 onChange={this.onChangeProgram.bind(this)}>
            {programs}
          </Input>
          <Button onClick={this.run.bind(this)}>Run</Button>
        </form>
      </div>
    );
  }
}
