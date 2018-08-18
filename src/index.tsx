import { Provider } from 'mobx-react';
import * as React from 'react';

import Routes from './router';
import * as stores from './store';

import './config';

export default class App extends React.Component {
  public render() {
    return (
      <Provider {...stores}>
        <Routes />
      </Provider>
    );
  }
}
