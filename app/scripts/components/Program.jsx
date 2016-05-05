import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Input, Button, Glyphicon} from 'react-bootstrap';
import {clone} from 'lodash';
import ProgramTimes from './ProgramTimes.jsx';

import 'styles/program.less';

export default class Program extends React.Component {
  static propTypes = {
    program: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      enabled: PropTypes.bool,
      scheduleString: PropTypes.string,
      times: ImmutablePropTypes.list
    }).isRequired,
    onDoneEditing: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      editing: false,
      editData: null
    }
  }

  onEditClick() {
    this.setState({
      editing: true,
      editData: clone(this.props.program)
    });
  }

  clearEditState() {
    this.setState({
      editing: false,
      editData: null
    });
  }

  onDoneEditClick() {
    this.props.onDoneEditing(this.state.editData);
    this.clearEditState();
  }

  onCancelEditClick() {
    this.clearEditState();
  }

  onScheduleChange(e) {
    const {editData} = this.state;
    this.setState({
      editData: {
        ...editData,
        scheduleString: e.target.value
      }
    })
  }

  onToggleEnabled() {
    const {editing, editData} = this.state;
    if (editing) {
      this.setState({
        editData: {
          ...editData,
          enabled: !editData.enabled
        }
      });
    }
  }

  onUpdateTimes(times) {
    const {editData} = this.state;
    this.setState({
      editData: {
        ...editData,
        times
      }
    });
  }

  onAddTimeClick() {
    const {editData} = this.state;
    this.setState({
      editData: {
        ...editData,
        times: editData.times.push({
          section: 0,
          time: 60
        })
      }
    })
  }

  render() {
    const {editing} = this.state;
    let dataSource;
    if (editing) {
      dataSource = this.state.editData;
    } else {
      dataSource = this.props.program;
    }
    const {name, enabled, scheduleString, times} = dataSource;
    let editButtons;
    let addButton;
    if (editing) {
      editButtons = (
        <span>
          <Button bsStyle='success' onClick={() => this.onDoneEditClick()}>Done</Button>
          <Button bsStyle='danger' onClick={() => this.onCancelEditClick()}>Cancel</Button>
        </span>
      );
      addButton = (
        <Button bsStyle='primary' onClick={() => this.onAddTimeClick()}><Glyphicon glyph='plus'/></Button>
      );
    } else {
      editButtons = <Button bsStyle='primary' onClick={() => this.onEditClick()}>Edit</Button>;
    }
    return (
      <div>
        <div className='form form-inline program-header'>
          <h3 className='program-name'>{name}</h3>
          <Button active={enabled} onClick={() => this.onToggleEnabled()}
                  disabled={!editing}>{enabled ? 'Enabled' : 'Disabled'}</Button>
          {editButtons}
        </div>
        <Input type='text' label='Schedule' value={scheduleString} readOnly={!editing}
               onChange={e => this.onScheduleChange(e)}/>
        <label>Times {addButton}</label>
        <ProgramTimes times={times} editing={editing} onUpdateTimes={times => this.onUpdateTimes(times)}/>
      </div>
    );
  }
}
