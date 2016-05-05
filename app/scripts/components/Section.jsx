import React, {PropTypes} from 'react';
import {Button, Label} from 'react-bootstrap';
import classNames from 'classnames';

export default class Section extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    pin: PropTypes.number.isRequired,
    value: PropTypes.oneOfType([ PropTypes.number, PropTypes.bool ]).isRequired,
    runTimeLeft: PropTypes.number,
    isLoading: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };

  render() {
    const {name, pin, value, runTimeLeft, isLoading, onClick} = this.props;
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
      <Button className={className} disabled={isLoading} onClick={() => this.props.onClick()}>
        {name}&nbsp;{labels}
      </Button>
    );
  }
}