import * as React from 'react';
import {observer} from 'mobx-react';
import {Input, Button} from 'react-bootstrap';

@observer
export default class RunSectionForm extends React.Component<any, any> {
  //static propTypes = {
  //  sectionStore: PropTypes.object.isRequired
  //};

  constructor() {
    super();
    this.state = {
      section: 0,
      time: ''
    };
  }

  onChangeSection = (e) => {
    this.setState({
      section: e.target.value
    });
  };

  onChangeTime = (e) => {
    this.setState({
      time: e.target.value
    });
  };

  run = (e) => {
    let {section, time} = this.state;
    let {sectionStore} = this.props;
    e.preventDefault();
    sectionStore.sections[section].runFor(time);
  };

  render() {
    let {sectionStore} = this.props;
    let sections = sectionStore.sections.map((section, i) => (
      <option key={i} value={i}>{section.name}</option>
    ));
    let {section, time} = this.state;
    return (
      <div>
        <h2>Run section</h2>

        <form onSubmit={this.run}>
          <Input type='select' label='Section' placeholder='Choose a section' value={section}
                 onChange={this.onChangeSection}>
            {sections}
          </Input>
          <Input type='number' label='Time (seconds)' min='0' max='21600' required value={time}
                 onChange={this.onChangeTime}/>
          <Button type='submit'>Run</Button>
        </form>
      </div>
    );
  }
}
