import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import {runProgram} from '../actions/programs.js'
import Programs from '../components/Programs.jsx';
import RunProgramForm from '../components/RunProgramForm.jsx';

@connect(state => ({
  programs: state.programs
}), dispatch => ({
  runProgram: (id) => dispatch(runProgram(id))
}))
class ProgramsPage extends React.Component {
  static propTypes = {
    programs: ImmutablePropTypes.list.isRequired,
    runProgram: PropTypes.func.isRequired
  };

  render() {
    let {programs, runProgram} = this.props;
    return (
      <div>
        <RunProgramForm programs={programs} runProgram={runProgram} />
        <Programs programs={programs}/>
      </div>
    );
  }
}

export default ProgramsPage;