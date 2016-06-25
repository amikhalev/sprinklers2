import * as React from 'react';
import {Button, Label} from 'react-bootstrap';
import * as classNames from 'classnames';
import {observer} from 'mobx-react';
import Section from "../models/Section";

export interface ISectionViewProps {
  section:Section,
  isLoading:boolean
  onClick:() => void
}

@observer
export default class SectionView extends React.Component<ISectionViewProps, void> {
  render() {
    const {section, isLoading, onClick} = this.props;
    const {name, pin, value, runTimeLeft} = section;
    let timeLeftLabel;
    if (runTimeLeft > 0) {
      timeLeftLabel = <Label bsStyle='primary'>{runTimeLeft} seconds left</Label>;
    }
    let pinLabel = <Label>pin {pin}</Label>;
    let labels = <div className='section-labels'>{timeLeftLabel}&nbsp;{pinLabel}</div>;
    let className = classNames({
      'section': true,
      'active': value
    });
    return (
      <Button className={className} disabled={isLoading} onClick={() => onClick()}>
        {name}&nbsp;{labels}
      </Button>
    );
  }
}