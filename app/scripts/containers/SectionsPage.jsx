import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {toggleSection, fetchSections, runSection} from '../actions/sections.js'
import Sections from '../components/Sections.jsx';
import RunSectionForm from '../components/RunSectionForm.jsx';

@connect(state => state.sections, dispatch => bindActionCreators({
  onRefreshClick: fetchSections,
  onSectionClick: toggleSection,
  onRunSectionClick: runSection
}, dispatch))
class SectionsPage extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    sections: ImmutablePropTypes.list.isRequired,
    onRefreshClick: PropTypes.func.isRequired,
    onSectionClick: PropTypes.func.isRequired,
    onRunSectionClick: PropTypes.func.isRequired
  };

  render() {
    let {isLoading, sections, onRefreshClick, onSectionClick, onRunSectionClick} = this.props;
    return (
      <div>
        <RunSectionForm sections={sections} runSection={onRunSectionClick} />
        <Sections isLoading={isLoading} sections={sections} onRefreshClick={onRefreshClick} onSectionClick={onSectionClick} />
      </div>
    );
  }
}

export default SectionsPage;