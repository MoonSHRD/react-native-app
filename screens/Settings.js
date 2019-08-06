import React, { Component } from 'react';
import { View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import { connect } from 'react-redux';

import { removeUserToken } from '../store/actions/AuthActions'
  
const { width, height } = Dimensions.get('window');

class Settings extends Component {
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

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.signup} behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
        <Block>
            <Button gradient style={styles.confirmButton}               
                onPress={() => {this._signOutAsync}}
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

  _signOutAsync =  () => {
    this.props.removeUserToken()
        .then(() => {
            this.props.navigation.navigate('SignedOut');
        })
        .catch(error => {
            this.setState({ error })
        })
};


}

const styles = StyleSheet.create({
})

const mapStateToProps = state => ({
  accessToken: state.accessToken,
});

const mapDispatchToProps = dispatch => ({
  removeUserToken: () => dispatch(removeUserToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);