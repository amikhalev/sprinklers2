import {createActions} from 'reflux';

export default createActions({
  'load': {asyncResults: true},
  'toggle': {asyncResults: true},
  'run': {asyncResults: true}
});
