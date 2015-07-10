import React from 'react';
import $ from 'jquery';
import {Button, ButtonGroup, Glyphicon} from 'react-bootstrap';
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
        alerts.add('danger', `Error loading sections: ${error}`);
      })
      .always(() => this.setState({ loading: false }));
  }

  render() {
    var loading = this.state.loading;
    var refreshBtn = (
      <Button disabled={loading} onClick={!loading ? this.load.bind(this) : null} ref='refresh'>
        {loading ? 'Loading...' : (<Glyphicon glyph='refresh'/>)}
      </Button>
    );
    let sections = this.state.sections.map(section => (
      <Button key={section.name} className={section.value ? 'active' : ''}>{section.name}</Button>
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
