import * as React from 'react';
import {Input, Button, ButtonGroup, Glyphicon} from 'react-bootstrap';

function humanReadableTime(seconds:number):string {
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

function reinsert(list, from, to) {
  let value = list.get(from);
  return list
    .remove(from)
    .splice(to, 0, value);
}

export default class ProgramTimes extends React.Component<any, any> {
  //static propTypes = {
  //  times: ImmutablePropTypes.listOf(PropTypes.shape({
  //    sectionId: PropTypes.number,
  //    time: PropTypes.number
  //  })).isRequired,
  //  editing: PropTypes.bool,
  //  onUpdateTimes: PropTypes.func.isRequired
  //};

  constructor() {
    super();
    this.state = {
      isDragging: false,
      draggingIdx: 0
    }
  }

  handleChangeSection(i, e) {
    const {times, onUpdateTimes} = this.props;
    onUpdateTimes(times.update(i, ({time}) => ({
      sectionId: Number(e.target.value),
      time
    })));
  }

  handleChangeTime(i, e) {
    const {times, onUpdateTimes} = this.props;
    onUpdateTimes(times.update(i, ({sectionId}) => ({
      sectionId,
      time: Number(e.target.value)
    })));
  }

  handleDeleteClick(i) {
    const {times, onUpdateTimes} = this.props;
    onUpdateTimes(times.delete(i));
  }

  startDragging(i) {
    if (this.props.editing) {
      this.setState({
        isDragging: true,
        draggingIdx: i
      });
    }
  }

  stopDragging() {
    this.setState({
      isDragging: false
    });
  }

  performDragTo(i) {
    const {times, onUpdateTimes} = this.props;
    const {isDragging, draggingIdx} = this.state;
    if (isDragging) {
      console.log(`onMouseEnter(${i})`);
      onUpdateTimes(reinsert(times, draggingIdx, i));
      this.setState({
        draggingIdx: i
      });
    }
  }

  renderSectionTime = (sectionTime, i) => {
    const {editing} = this.props;
    const {sectionId, time} = sectionTime;
    let sectionLabel, timeLabel, actions;
    if (editing) {
      sectionLabel = (
        <Input type='number' value={sectionId} onChange={e => this.handleChangeSection(i, e)}/>
      );
      timeLabel = (
        <Input type='number' min='0' max='3600' value={time} addonAfter='s'
               onChange={e => this.handleChangeTime(i, e)}/>
      );
      actions = (
        <td className='program-time-actions'>
          <Button bsStyle='danger' onClick={() => this.handleDeleteClick(i)}>
            <Glyphicon glyph='remove'/>
          </Button>
        </td>
      );
    } else {
      sectionLabel = String(sectionId);
      timeLabel = humanReadableTime(time);
    }
    const {isDragging, draggingIdx} = this.state;
    const dragging = isDragging && draggingIdx == i;
    const startDragging = () => this.startDragging(i);
    const performDragTo = () => this.performDragTo(i);
    const styles = `form form-inline program-time ${dragging ? 'dragging' : ''}`;
    return (
      <tr key={i} className={styles} /*onMouseDown={startDragging} onTouchStart={startDragging}
          onMouseOver={performDragTo}*/>
        <td>{sectionLabel}</td>
        <td>{timeLabel}</td>
        {actions}
      </tr>
    );
  };

  render() {
    const {editing, times} = this.props;
    const {isDragging} = this.state;
    const timeRows = times
      .map(this.renderSectionTime)
      .toArray();
    const stopDragging = () => this.stopDragging();
    return (
      <table className={`table table-bordered program-times ${isDragging ? 'dragging' : ''}`}
             onMouseUp={stopDragging} onTouchEnd={stopDragging}>
        <thead>
        <tr>
          <th className='program-time-header-section'>#</th>
          <th>Time</th>
          {editing ? <th>Actions</th> : null}
        </tr>
        </thead>
        <tbody>
        {timeRows}
        </tbody>
      </table>
    );
  }
}
