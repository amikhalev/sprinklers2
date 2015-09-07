import React, {PropTypes} from 'react';
import {Input, Button, ButtonGroup, Glyphicon} from 'react-bootstrap';
import ProgramStore from '../stores/ProgramStore.js';

export default class Program extends React.Component {
  static propTypes = {
    program: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      editing: false
    };
  }

  edit = () => {
    this.setState({
      editing: true
    });
  };

  done = () => {
    this.setState({
      editing: false
    });
  };

  handleScheduleChange = (event) => {
    ProgramStore.setWhen(this.props.program.name, event.target.value);
  };

  renderTime = (time, i) => {
    const {editing} = this.state;
    let actions;
    if (editing) {
      actions = (
        <td>
          <ButtonGroup>
            <Button bsStyle='danger'><Glyphicon glyph='remove'/></Button>
            <Button bsStyle='default'><Glyphicon glyph='arrow-up'/></Button>
            <Button bsStyle='default'><Glyphicon glyph='arrow-down'/></Button>
          </ButtonGroup>
        </td>
      );
    }
    return (
      <tr key={i}>
        <td>{i}</td>
        <td className='form form-inline'>
          <Input type='number' min='0' max='3600' value={time} addonAfter='s' readOnly={!editing}/>
        </td>
        {actions}
      </tr>
    );
  };

  render() {
    let {name, enabled, running, when, times} = this.props.program;
    let {editing} = this.state;
    times = times.map(this.renderTime);
    let editBtn;
    if (editing) {
      editBtn = <Button className='right' bsStyle='success' onClick={this.done}>Done</Button>;
    } else {
      editBtn = <Button className='right' bsStyle='primary' onClick={this.edit}>Edit</Button>;
    }
    return (
      <div>
        <div className='form form-inline'>
          <h3>{name}</h3>&nbsp;
          <Input checked={enabled} readOnly={!editing} label='Enabled' type='checkbox'/>&nbsp;
          <Input checked={running} readOnly={!editing} label='Running' type='checkbox'/>&nbsp;
          {editBtn}
        </div>
        <Input type='text' label='Schedule' value={when} readOnly={!editing} onChange={this.handleScheduleChange}/>
        <label>Times</label>
        <table className='table table-bordered'>
          <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
            {editing ? <th>Actions</th> : null}
          </tr>
          </thead>
          <tbody>{times}</tbody>
        </table>
      </div>
    );
  }
}
