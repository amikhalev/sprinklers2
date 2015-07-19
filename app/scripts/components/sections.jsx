import React, {PropTypes} from 'react';
import {Button, ButtonGroup, Label, Glyphicon} from 'react-bootstrap';
import SectionStore from '../stores/SectionStore.js';

export default class Sections extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    sections: PropTypes.array
  }

  static defaultProps = {
    loading: false,
    sections: []
  }

  constructor() {
    super();
    this.state = {
      now: new Date()
    };
  }

  componentDidMount() {
    this.ticker = setInterval(this.tick.bind(this), 1000);
  }

  componentDidUnmount() {
    clearInterval(this.ticker);
  }

  load() {
    SectionStore.load();
  }

  toggle(index) {
    SectionStore.toggle(index);
  }

  tick() {
    this.setState({
      now: new Date()
    });
  }

  render() {
    var loading = this.props.loading;
    var refreshBtn = (
      <Button disabled={loading} onClick={!loading ? this.load.bind(this) : null} ref='refresh'>
        {loading ? 'Loading...' : (<Glyphicon glyph='refresh'/>)}
      </Button>
    );
    let sections = this.props.sections.map((section, index) => {
      var timeLeft;
      if (section.endTime != null) {
        var msLeft = new Date(section.endTime).getTime() - this.state.now.getTime();
        var left = Math.ceil(msLeft / 1000);
        if (left > 0) {
          timeLeft = <Label bsStyle='primary'>{left} seconds left</Label>;
        }
      }
      var pin = <Label>pin {section.pin}</Label>;
      return (
        <Button key={section.name} className={section.value ? 'active' : ''}
                disabled={loading} onClick={this.toggle.bind(this, index)}>
          {section.name}&nbsp;
          <div className='right'>{timeLeft}&nbsp;{pin}</div>
        </Button>
      );
    });
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
