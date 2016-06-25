import * as React from 'react';
import {List} from 'immutable';
import {ListGroup, ListGroupItem, Button, Glyphicon} from 'react-bootstrap';
import Program from "../models/Program";
import ProgramView from './ProgramView';

export interface IProgramsProps {
  programs: Array<Program>,
  onRefreshClick: () => void
}

export default class Programs extends React.Component<IProgramsProps, void> {
  static defaultProps = {
    programs: []
  };

  renderProgram = (program) => (
    <ListGroupItem key={program.id}>
      <ProgramView program={program}/>
    </ListGroupItem>
  );

  render() {
    const programs = this.props.programs.map(this.renderProgram);
    let refreshButton = (
      <Button onClick={() => this.props.onRefreshClick()}><Glyphicon glyph='refresh'/></Button>
    );
    return (
      <div>
        <h2>Programs {refreshButton}</h2>
        <ListGroup>
          {programs}
        </ListGroup>
      </div>
    );
  }
}
