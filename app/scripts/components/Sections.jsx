import React, {PropTypes} from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {Button, ButtonGroup, Label, Glyphicon} from 'react-bootstrap';
import Section from './Section.jsx';

import 'styles/section.less';

export default class Sections extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    sections: ImmutablePropTypes.list.isRequired,
    onRefreshClick: PropTypes.func.isRequired,
    onSectionClick: PropTypes.func.isRequired
  };

  static defaultProps = {
    isLoading: false,
    sections: []
  };

  constructor() {
    super();
    this.state = {
      now: new Date()
    };
  }

  componentDidMount() {
    let msUntilNextSecond = 1000 - new Date().getMilliseconds();
    this.timeout = setTimeout(() => {
      this.timeout = null;
      this.tick();
      this.ticker = setInterval(this.tick.bind(this), 1000);
    }, msUntilNextSecond);
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    if (this.ticker) {
      clearInterval(this.ticker);
    }
  }

  tick() {
    this.setState({
      now: new Date()
    });
  }

  renderSection = (section, index) => {
    let secondsLeft = 0;
    if (section.endTime != null) {
      let msLeft = new Date(section.endTime).getTime() - this.state.now.getTime();
      if (msLeft > 0) {
        secondsLeft = Math.ceil(msLeft / 1000);
      }
    }
    return (
      <Section key={section.name} {...section} runTimeLeft={secondsLeft} isLoading={this.props.isLoading}
               onClick={() => this.props.onSectionClick(section.id)}/>
    );
  };

  render() {
    const {isLoading, onRefreshClick} = this.props;
    let refreshBtn = (
      <Button disabled={isLoading} onClick={!isLoading ? this.props.onRefreshClick : null}>
        {isLoading ? 'Loading...' : (<Glyphicon glyph='refresh'/>)}
      </Button>
    );
    let sections = this.props.sections.map(this.renderSection).toArray();
    return (
      <div className='sections'>
        <h2>Section states&nbsp;{refreshBtn}</h2>
        <ButtonGroup vertical block>
          {sections}
        </ButtonGroup>
      </div>
    );
  }
}
