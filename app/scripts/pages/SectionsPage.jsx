import React from 'react';
import {connect as connectToStore} from 'reflux';
import Sections from '../components/Sections.jsx';
import RunSectionForm from '../components/RunSectionForm.jsx';
import SectionStore from '../stores/SectionStore.js';

export default React.createClass({
  mixins: [connectToStore(SectionStore)],

  render() {
    let {sections} = this.state;
    return (
      <div>
        <RunSectionForm sections={sections}/>
        <Sections sections={sections}/>
      </div>
    );
  }
});
