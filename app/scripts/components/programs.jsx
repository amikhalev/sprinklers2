import React from 'react';
import $ from 'jquery';
import {Table} from 'react-bootstrap';
import alerts from '../alerts.js';

export default class Program extends React.Component {
  constructor() {
    super();
    this.state = {
      programs: []
    };
  }

  componentDidMount() {
    $.getJSON('/programs')
      .success(programs => this.setState({programs}))
      .fail((xhr, state, error) => {
        alerts.add('danger', `Error loading programs: ${error}`);
      });
  }

  render() {
    let programs = this.state.programs.map((program) => {
      let times = program.times.map((time, i) => (
        <li key={i}>{time} s</li>
      ));
      return (
        <tr key={program.name}>
          <td>
            <input checked={program.enabled} readOnly type='checkbox'/>
          </td>
          <td>{program.name}</td>
          <td><code>{program.when}</code></td>
          <td>
            <ol>{times}</ol>
          </td>
        </tr>
      );
    });
    return (
      <div>
        <h2>Programs</h2>
        <Table>
          <thead>
          <th>Enabled</th>
          <th>Name</th>
          <th>Schedule</th>
          <th>Times</th>
          </thead>
          <tbody>
          {programs}
          </tbody>
        </Table>
      </div>
    );
  }
}
