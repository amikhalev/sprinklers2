import * as React from 'react';
import {observer} from 'mobx-react';
import {Button, ButtonGroup, Label, Glyphicon} from 'react-bootstrap';

import SectionView from './SectionView';
import SectionStore from "../stores/SectionStore";

import 'styles/section.less';

export interface ISectionsProps {
  sectionStore: SectionStore
}

@observer
export default class Sections extends React.Component<ISectionsProps, void> {
  timeout;
  ticker;

  renderSection = (section) => (
    <SectionView key={section.id} section={section} isLoading={section.store.isLoading}
                 onClick={() => section.toggle()}/>
  );

  render() {
    const {sectionStore} = this.props;
    const {isLoading, sections} = sectionStore;
    let refreshBtn = (
      <Button disabled={isLoading} onClick={!isLoading ? () => sectionStore.loadSections() : null}>
        {isLoading ? 'Loading...' : (<Glyphicon glyph='refresh'/>)}
      </Button>
    );
    let sectionViews = sections.map(this.renderSection);
    return (
      <div className='sections'>
        <h2>Section states&nbsp;{refreshBtn}</h2>
        <ButtonGroup vertical block>
          {sectionViews}
        </ButtonGroup>
      </div>
    );
  }
}
