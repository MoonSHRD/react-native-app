import React, { Component } from 'react';
import { View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

const { width, height } = Dimensions.get('window');

export default class ChatList extends Component {
  static navigationOptions = {
    headerLeft: (
      <Icon
        name="ios-create" 
        size={24} 
        color={theme.colors.blue}
        onPress={() => alert('This is a button!')}
        style={{paddingVertical: 10, paddingHorizontal: 20,}}
      />
    ),
    headerRight: (
      <Icon
        name="ios-person" 
        size={24} 
        color={theme.colors.blue}
        onPress={() => alert('This is a button!')}
        style={{paddingVertical: 10, paddingHorizontal: 20,}}
      />
    ),
  };
  state = {

  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.signup} behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
        <Text h1 gray center>Chat List page</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
})
