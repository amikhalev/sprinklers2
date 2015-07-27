import React, {PropTypes} from 'react';
import {ListGroup, ListGroupItem} from 'react-bootstrap';
import Program from './Program.jsx';

export default class Programs extends React.Component {
  static propTypes = {
    programs: PropTypes.array
  };

  static defaultProps = {
    programs: []
  };

  renderProgram = program => (
    <ListGroupItem key={program.name}>
      <Program program={program}/>
    </ListGroupItem>
  );

  render() {
    let programs = this.props.programs.map(this.renderProgram);
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
