import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Input, Button, ButtonGroup, Glyphicon} from 'react-bootstrap';

function humanReadableTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;

  let string = `${seconds} s`;
  if (minutes || hours) {
    string = `${minutes} m ${string}`;
  }
  if (hours) {
    string = `${hours} h ${string}`;
  }
  return string;
}

export default class ProgramTimes extends React.Component {
  static propTypes = {
    times: ImmutablePropTypes.listOf(PropTypes.shape({
      section: PropTypes.number,
      time: PropTypes.number
    })).isRequired,
    editing: PropTypes.bool,
    onUpdateTimes: PropTypes.func.isRequired
  };

  onChangeTime(i, e) {
    const {times, onUpdateTimes} = this.props;
    onUpdateTimes(times.update(i, ({section}) => ({
      section,
      time: Number(e.target.value)
    })));
  }

  onDeleteClick(i) {
    const {times, onUpdateTimes} = this.props;
    onUpdateTimes(times.delete(i));
  }

  onMoveUpClick(i) {
    if (i !== 0) {
      const {times, onUpdateTimes} = this.props;
      let time = times.get(i);
      onUpdateTimes(times.delete(i).splice(i - 1, 0, time));
    }
  }

  onMoveDownClick(i) {
    const {times, onUpdateTimes} = this.props;
    if (i < times.size - 1) {
      let time = times.get(i);
      onUpdateTimes(times.delete(i).splice(i + 1, 0, time));
    }
  }

  renderSectionTime = (sectionTime, i) => {
    const {editing} = this.props;
    const {section, time} = sectionTime;
    let sectionLabel, timeLabel, actions;
    if (editing) {
      sectionLabel = (
        <Input type='number' value={section} onChange={e => this.onChangeSection(i, e)}/>
      );
      timeLabel = (
        <Input type='number' min='0' max='3600' value={time} addonAfter='s' onChange={e => this.onChangeTime(i, e)}/>
      );
      actions = (
        <td className='program-time-actions'>
          <Button bsStyle='danger' onClick={() => this.onDeleteClick(i)}>
            <Glyphicon glyph='remove'/>
          </Button>
          <Button bsStyle='default' onClick={() => this.onMoveUpClick(i)} disabled={i === 0}>
            <Glyphicon glyph='arrow-up'/>
          </Button>
          <Button bsStyle='default' onClick={() => this.onMoveDownClick(i)}
                  disabled={i === this.props.times.size - 1}>
            <Glyphicon glyph='arrow-down'/>
          </Button>
        </td>
      );
    } else {
      sectionLabel = String(section);
      timeLabel = humanReadableTime(time);
    }
    return (
      <tr key={i} className='form form-inline'>
        <td>{sectionLabel}</td>
        <td>{timeLabel}</td>
        {actions}
      </tr>
    );
  };

  render() {
    const {editing, times} = this.props;
    const timeRows = times.map(this.renderSectionTime).toArray();
    return (
      <table className='table table-bordered'>
        <thead>
        <tr>
          <th className='program-time-header-section'>#</th>
          <th>Time</th>
          {editing ? <th>Actions</th> : null}
        </tr>
        </thead>
        <tbody>{timeRows}</tbody>
      </table>
    );
  }
}
