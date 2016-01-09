import React from 'react';
import {Provider} from 'react-redux';
import routes from './routes.jsx';

const root = ({store}) => (
  <Provider store={store}>
    {routes}
  </Provider>
);

export default root;
