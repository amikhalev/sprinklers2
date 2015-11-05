import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {runProgram, updateProgram} from '../actions/programs.js'
import Programs from '../components/Programs.jsx';
import RunProgramForm from '../components/RunProgramForm.jsx';

@connect(state => state.programs, dispatch => bindActionCreators({
  onRunProgramClick: runProgram,
  updateProgram
}, dispatch))
class ProgramsPage extends React.Component {
  static propTypes = {
    programs: ImmutablePropTypes.list.isRequired,
    onRunProgramClick: PropTypes.func.isRequired,
    updateProgram: PropTypes.func.isRequired
  };

  render() {
    let {programs, onRunProgramClick, updateProgram} = this.props;
    return (
      <div>
        <RunProgramForm programs={programs} onRunProgramClick={onRunProgramClick} />
        <Programs programs={programs} updateProgram={updateProgram} />
      </div>
    );
  }
}

export default ProgramsPage;