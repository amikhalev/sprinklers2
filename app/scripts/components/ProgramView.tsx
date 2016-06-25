import * as React from 'react';
import {Input, Button, Glyphicon} from 'react-bootstrap';
import * as _ from 'lodash';

import ProgramTimes from './ProgramTimes';
import Program, {IProgram} from "../models/Program";

import 'styles/program.less';
import ProgramTime from "../models/ProgramTime";

// this is a hack
function programWith(program:IProgram, data:{}):IProgram {
  return _.assign({}, program, data) as IProgram;
}

export interface IProgramViewProps {
  program:Program
}

interface IProgramViewState {
  editData:IProgram
}

export default class ProgramView extends React.Component<IProgramViewProps, IProgramViewState> {
  constructor() {
    super();
    this.state = {
      editData: null
    }
  }

  onEditClick() {
    this.setState({
      editData: this.props.program.getEditData()
    });
  }

  clearEditState() {
    this.setState({
      editData: null
    });
  }

  onDoneEditClick() {
    this.props.program.updateToServer(this.state.editData);
    this.clearEditState();
  }

  onCancelEditClick() {
    this.clearEditState();
  }

  onScheduleChange(e) {
    const {editData} = this.state;
    const value = e.target.value as string;
    this.setState({
      editData: programWith(editData, {
        scheduleString: value
      })
    });
  }

  onToggleEnabled() {
    const {editData} = this.state;
    if (editData !== null) {
      this.setState({
        editData: programWith(editData, {
          enabled: !editData.enabled
        })
      });
    }
  }

  onUpdateTimes(times) {
    const {editData} = this.state;
    this.setState({
      editData: programWith(editData, { times })
    });
  }

  onAddTimeClick() {
    const {editData} = this.state;
    const newTime:ProgramTime = ProgramTime.fromJson({
      section: 0,
      time: 60
    });
    this.setState({
      editData: programWith(editData, {
        times: editData.times.concat(newTime)
      })
    })
  }

  render() {
    let dataSource:IProgram;
    const editing:boolean = this.state.editData !== null;
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
        <Button bsStyle='primary' onClick={() => this.onAddTimeClick()}>
          <Glyphicon glyph='plus'/>
        </Button>
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
