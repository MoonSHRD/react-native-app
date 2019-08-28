<script src="http://localhost:8097"></script>
import React from 'react';
import {
  AppRegistry
} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import Store from './store/store'

const Root = () => (
  <Provider store={Store}>
    <App />
  </Provider>
)

AppRegistry.registerComponent(appName, () => Root);