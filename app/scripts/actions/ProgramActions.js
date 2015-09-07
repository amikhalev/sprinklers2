import {createActions} from 'reflux';

export default createActions({
  'load': {asyncResults: true},
  'run': {asyncResults: true}
});
