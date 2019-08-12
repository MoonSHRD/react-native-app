import React from 'react';
import { StyleSheet, AsyncStorage } from 'react-native';
import {connect} from 'react-redux';

import { Block } from './components';
import { createRootNavigator } from "./navigation/router";

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: true,
      isLoadingComplete: false,
    };
  }

  componentDidMount() {
    // this._isSignedInAsync()
    //   .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
    //   .catch(err => alert("An error occurred"));
  }

//   _isSignedInAsync =  () => {
//     return new Promise((resolve, reject) => {
//     this.props.getUserToken()
//         .then(res => {
//           if (res !== null) {
//           resolve(true);
//           } else {
//           resolve(false);
//           }
//         })
//         .catch(err => reject(err));
//     });
// };

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
