import 'babel/polyfill';
import 'whatwg-fetch';

import ReactDOM from 'react-dom';

import {load as loadPrograms} from './actions/programs.js';
import {load as loadSections} from './actions/sections.js';

import App from './containers/App.jsx';

loadPrograms();
loadSections();

ReactDOM.render(App, document.getElementById('app'));
