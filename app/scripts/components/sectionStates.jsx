import React from 'react';
import $ from 'jquery';
import {Button, ButtonGroup, Label, Glyphicon} from 'react-bootstrap';
import alerts from '../alerts.js';

export default class SectionStates extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      sections: []
    };
  }

  componentDidMount() {
    this.load();
  }

  load() {
    this.setState({loading: true});
    $.getJSON('/sections')
      .success(sections => this.setState({sections}))
      .fail((xhr, state, error) => {
        alerts.add('danger', `Failed to fetch sections: ${error}`);
      })
      .always(() => this.setState({loading: false}));
  }

  toggle(index) {
    this.setState({loading: true});
    $.ajax(`/sections/${index}`, {
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        value: !this.state.sections[index].value
      })
    })
      .success(sections => this.setState({sections}))
      .fail((xhr, state, error) => {
        alerts.add('danger', `Failed to toggle section: ${error}`);
      })
      .always(() => this.setState({loading: false}));
  }

  render() {
    var loading = this.state.loading;
    var refreshBtn = (
      <Button disabled={loading} onClick={!loading ? this.load.bind(this) : null} ref='refresh'>
        {loading ? 'Loading...' : (<Glyphicon glyph='refresh'/>)}
      </Button>
    );
    let sections = this.state.sections.map((section, index) => (
      <Button key={section.name} className={section.value ? 'active' : ''} disabled={loading} onClick={this.toggle.bind(this, index)}>
        {section.name}&nbsp;<Label className='right'>pin {section.pin}</Label>
      </Button>
    ));
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
