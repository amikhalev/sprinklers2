import {OrderedMap} from 'immutable';

/**
 * The list of navigation links of the app. Keys are paths, values are the labels.
 * @type {Immutable.OrderedMap<string, string>}
 */
const navigation = OrderedMap<string, string>([
  ['/sections', 'Sections'],
  ['/programs', 'Programs']
]);

export default navigation;