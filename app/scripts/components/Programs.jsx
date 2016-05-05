import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {List} from 'immutable';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import Program from './Program.jsx';

export default class Programs extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    programs: ImmutablePropTypes.list.isRequired,
    updateProgram: PropTypes.func.isRequired
  };

  static defaultProps = {
    programs: List()
  };

  renderProgram = (program) => (
    <ListGroupItem key={program.id}>
      <Program program={program} onDoneEditing={data => this.props.updateProgram(program.id, data)}/>
    </ListGroupItem>
  );

  render() {
    let programs = this.props.programs.map(this.renderProgram).toArray();
    return (
      <div>
        <h2>Programs</h2>
        <ListGroup>
          {programs}
        </ListGroup>
      </div>
    );
  }
}
