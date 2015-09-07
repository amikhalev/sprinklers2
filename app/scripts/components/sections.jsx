import React, {PropTypes} from 'react';
import {Button, ButtonGroup, Label, Glyphicon} from 'react-bootstrap';
import {load, toggle} from '../actions/SectionActions.js';

export default class Sections extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    sections: PropTypes.array.isRequired
  };

  static defaultProps = {
    loading: false,
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
    const {loading} = this.props;
    let timeLeft;
    if (section.endTime != null) {
      var msLeft = new Date(section.endTime).getTime() - this.state.now.getTime();
      var left = Math.ceil(msLeft / 1000);
      if (left > 0) {
        timeLeft = <Label bsStyle='primary'>{left} seconds left</Label>;
      }
    }
    let pin = <Label>pin {section.pin}</Label>;
    return (
      <Button key={section.name} className={section.value ? 'active' : ''}
              disabled={loading} onClick={toggle.bind(this, index)}>
        {section.name}&nbsp;
        <div className='right'>{timeLeft}&nbsp;{pin}</div>
      </Button>
    );
  };

  render() {
    const {loading} = this.props;
    let refreshBtn = (
      <Button disabled={loading} onClick={!loading ? load : null} ref='refresh'>
        {loading ? 'Loading...' : (<Glyphicon glyph='refresh'/>)}
      </Button>
    );
    let sections = this.props.sections.map(this.renderSection);
    return (
      <div>
        <h2>Section states&nbsp;{refreshBtn}</h2>
        <ButtonGroup vertical block>
          {sections}
        </ButtonGroup>
      </div>
    );
  }
}
