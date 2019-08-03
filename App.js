import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Navigation from './navigation/index';
import { Block } from './components';

console.disableYellowBox = true;

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  render() {
    return (
      <Block white>
        <Navigation />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
});
