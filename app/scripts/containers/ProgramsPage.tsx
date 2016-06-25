import * as React from 'react';
import {observer} from 'mobx-react';

import {IStores} from "../stores/index";
import Programs from '../components/Programs';
import RunProgramForm from '../components/RunProgramForm';

@observer
class ProgramsPage extends React.Component<IStores, void> {
  render() {
    const {programStore} = this.props;
    const {programs, isLoading} = programStore;
    return (
      <div>
        <RunProgramForm programs={programs}/>
        <Programs programStore={programStore}/>
      </div>
    );
  }
}

export default ProgramsPage;