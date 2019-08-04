import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { isSignedIn } from "./state/auth";

import { Block } from './components';
import { createRootNavigator } from "./navigation/router";

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: false,
      isLoadingComplete: false,

    };
  }

  componentDidMount() {
    isSignedIn()
      .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
      .catch(err => alert("An error occurred"));
  }


  render() {
    const { checkedSignIn, signedIn } = this.state;

    if (!checkedSignIn) {
      return null;
    }

    const Navigation = createRootNavigator(signedIn);
    return (
        <Block white>
          <Navigation />
        </Block>
    );
  }
}

const styles = StyleSheet.create({
});
