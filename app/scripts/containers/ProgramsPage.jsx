import React from 'react';
import {connect as connectToStore} from 'reflux';
import Programs from '../components/Programs.jsx';
import RunProgramForm from '../components/RunProgramForm.jsx';
import ProgramStore from '../stores/ProgramStore.js';

export default React.createClass({
  mixins: [connectToStore(ProgramStore)],

  render() {
    let {programs} = this.state;
    return (
      <div>
        <RunProgramForm programs={programs}/>
        <Programs programs={programs}/>
      </div>
    );
  }
});
