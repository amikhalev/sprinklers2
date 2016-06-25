import * as React from 'react';
import {List} from 'immutable';
import {Input, Button} from 'react-bootstrap';
import ProgramStore from "../stores/ProgramStore";
import Program from "../models/Program";

export interface IRunProgramFormProps {
  programs:Array<Program>
}

interface IRunProgramFormState {
  programIdx:number;
}

export default class RunProgramForm extends React.Component<IRunProgramFormProps, IRunProgramFormState> {
  constructor() {
    super();
    this.state = {
      programIdx: 0
    };
  }

  onChangeProgram = (e) => {
    this.setState({
      programIdx: e.target.value
    });
  };

  run = (e) => {
    const programIdx = this.state.programIdx;
    this.props.programs[programIdx].run();
    e.preventDefault();
  };

  render() {
    let {programIdx} = this.state;
    const {programs} = this.props;
    let programOptions = programs.map((program, i) => (
      <option key={i} value={i}>{program.name}</option>
    ));
    return (
      <div>
        <h2>Run program</h2>

        <form>
          <Input type='select' label='Program' placeholder='Choose a program' value={programIdx}
                 onChange={this.onChangeProgram}>
            {programOptions}
          </Input>
          <Button onClick={this.run}>Run</Button>
        </form>
      </div>
    );
  }
}
