import React from 'react';
import $ from 'jquery';
import {Input, Button} from 'react-bootstrap';
import alerts from '../alerts.js';

export default class RunSectionForm extends React.Component {
  constructor() {
    super();
    this.state = {
      sections: []
    };
  }

  componentDidMount() {
    $.getJSON('/sections')
      .success(sections => this.setState({sections}))
      .fail((xhr, status, error) => {
        alerts.add('danger', `Failed to fetch sections: ${error}`);
      });
  }

  run(e) {
    let section = this.refs.section.getValue();
    let time = this.refs.time.getValue();
    $.ajax(`/sections/${section}/run`, {
      method: 'POST',
      data: JSON.stringify({
        time
      }),
      contentType: 'application/json'
    })
      .done(() => {
        var sectionName = this.state.sections[section].name;
        alerts.add('success', `Running section '${sectionName}' for ${time} seconds`, true);
      })
      .fail((xhr, status, error) => {
        alerts.add('danger', `Failed to run section: ${error}`);
      });
    e.preventDefault();
  }

  render() {
    let sections = this.state.sections.map((section, i) => (
      <option key={section.name} value={i}>{section.name}</option>
    ));
    return (
      <div>
        <h2>Run section</h2>

        <form>
          <Input type='select' label='Section' placeholder='Choose a section' ref='section'>
            {sections}
          </Input>
          <Input type='number' label='Time (seconds)' min='0' max='3600' ref='time' required/>
          <Button onClick={this.run.bind(this)}>Run</Button>
        </form>
      </div>
    );
  }
}
