import React, {PropTypes} from 'react';
import {Input} from 'react-bootstrap';

export default class Program extends React.Component {
  static propTypes = {
    program: PropTypes.object
  };

  render() {
    let {name, enabled, running, when, times} = this.props.program;
    times = times.map((time, i) => (
      <li key={i}>{time} s</li>
    ));
    return (
      <div>
        <h3>{name}</h3>
        <Input checked={enabled} readOnly label='Enabled' type='checkbox'/>
        <Input checked={running} readOnly label='Running' type='checkbox'/>
        <h4>Schedule</h4>
        <code>{when}</code>
        <h4>Times</h4>
        <ol>{times}</ol>
      </div>
    );
  }
}
