import React from 'react';
import $ from 'jquery';
import {Input, Button} from 'react-bootstrap';
import alerts from '../alerts.js';

export default class RunProgramForm extends React.Component {
  constructor() {
    super();
    this.state = {
      programs: []
    };
  }

  componentDidMount() {
    $.getJSON('/programs')
      .success(programs => this.setState({programs}))
      .fail((xhr, status, error) => {
        alerts.add('danger', `Failed to fetch programs: ${error}`);
      });
  }

  run(e) {
    let program = this.refs.program.getValue();
    $.ajax(`/programs/${program}/run`, {
      method: 'POST'
    })
      .done(() => {
        var programName = this.state.programs[program].name;
        alerts.add('success', `Running program '${programName}'`, true);
      })
      .fail((xhr, status, error) => {
        alerts.add('danger', `Failed to run program: ${error}`);
      });
    e.preventDefault();
  }

  render() {
    let programs = this.state.programs.map((program, i) => (
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
