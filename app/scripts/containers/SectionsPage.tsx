import * as React from 'react';
import {observer} from 'mobx-react';

import {IStores} from "../stores/index";
import Sections from '../components/Sections';
import RunSectionForm from '../components/RunSectionForm';
import SectionStore from "../stores/SectionStore";

@observer
class SectionsPage extends React.Component<IStores, void> {
  render() {
    let {sectionStore} = this.props;
    return (
      <div>
        <RunSectionForm sectionStore={sectionStore}/>
        <Sections sectionStore={sectionStore}/>
      </div>
    );
  }
}

export default SectionsPage;