import 'babel/polyfill';
import 'whatwg-fetch';

import ReactDOM from 'react-dom';

import {fetchPrograms} from './actions/programs.js';
import programStore from './stores/programs.js';
import {load as loadSections} from './actions/sections.js';

import App from './containers/App.jsx';

programStore.dispatch(fetchPrograms());
loadSections();

ReactDOM.render(App, document.getElementById('app'));
