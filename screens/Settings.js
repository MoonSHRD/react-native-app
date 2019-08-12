import React, { Component } from 'react';
import { Platform, View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import MatrixLoginClient from '../native/MatrixLoginClient';

import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

const { width, height } = Dimensions.get('window');

export default class Settings extends Component {
  static navigationOptions = {
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

  handleSignOut = () => {
    if (Platform.OS === 'android') {
      MatrixLoginClient.logout(
        (err) => { error = err },
        (err) => { error = err },
        (err)=>console.log(err),
        ()=>console.log('success')
      )  
    }
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
        <Block>
            <Button gradient style={styles.confirmButton}               
                onPress={this.handleSignOut}
            >
                {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text headline bold white center>Sign Out</Text>
                }
            </Button>       
        </Block>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
})