import React, { Component } from 'react';
import { View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import Logo from '../assets/images/logo-small.svg';
import TextLogo from '../assets/images/text-logo.svg';
import Twitter from '../assets/icons/twitter.svg';
import Facebook from '../assets/icons/instagram.svg';
import Instagram from '../assets/icons/facebook.svg';

import { connect } from 'react-redux';
import { saveUserToken } from '../store/actions/AuthActions'

const { width, height } = Dimensions.get('window');

const VALID_EMAIL = "login@renaissance.com";
const VALID_PASSWORD = "subscribe";

class Login extends Component {
  static navigationOptions = {
    header: null
  }
  state = {
    email: null,
    password: null,
    errors: [],
    loading: false,
  }

  handleLogin() {
    const { navigation } = this.props;
    const { email, password } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    if (email !== VALID_EMAIL) {
      errors.push('email');
    }
    if (password !== VALID_PASSWORD) {
      errors.push('password');
    }

    this.setState({ errors, loading: false });

    if (!errors.length) {
      navigation.navigate("ContactList");
    }
  }

  _signInAsync =  () => {
    export const USER_KEY = "auth-demo-key";
    this.props.saveUserToken(USER_KEY, "true")
        .then(() => {
            this.props.navigation.navigate('SignedIn');
        })
        .catch(error => {
            this.setState({ error })
        })
};

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.signup} behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
        <Block padding={[height / 10, theme.sizes.base * 2]}>
          <View style={styles.imageContainer}>
            <Logo width={width / 6.7} height={height / 6.7} />
            <TextLogo style={styles.textLogo}/>
          </View>
          <Text headline semibold center>Login</Text>
          <Block middle style={styles.formContainer}>
            <Input
              email
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              defaultValue={this.state.email}
              placeholder={'Enter your email'}
              onChangeText={text => this.setState({ email: text })}
            />
            <Input
              secure
              error={hasErrors('password')}
              style={[styles.input, hasErrors('password')]}
              defaultValue={this.state.password}
              placeholder={'Enter password'}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button gradient style={styles.confirmButton}               
              onPress={this._signInAsync}
            >
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text headline bold white center>Confirm</Text>
              }
            </Button>
            <Button style={styles.textButton} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text gray footnote center>
                Don't have an account? <Text gray footnote style={{ textDecorationLine: 'underline' }}>Register</Text>
              </Text>
            </Button>
            <View style={styles.divider}>
              <View style = {styles.lineStyle} />
              <Text gray footnote center>or</Text>
              <View style = {styles.lineStyle} />
            </View>
            <View style={styles.socialMedia}>
              <Twitter width={48} height={48} />
              <Facebook width={48} height={48} style={styles.centeredIcon}/>
              <Instagram width={48} height={48} />
            </View>
          </Block>
        </Block>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  signup: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.blueBackground,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: height / 10,
  },
  mainLogo: {
    width: width / 3.26,
    height: width / 3.26,
  },
  textLogo: {
    marginTop: height / 55,
    width: width / 1.7,
    height: height / 50,
  },
  formContainer: {
    flex: 0,
    marginTop: height / 50,
  },
  input: {
    borderWidth: 0,
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    fontSize: 17,
    textAlign: 'center',
    margin: 0,
    color: '#333333',
  },
  confirmButton: {
    marginTop: 15,
  },
  textButton: {
    marginTop: 36,
    backgroundColor: theme.colors.blueBackground,
  },
  divider: {
    flex: 0,
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    margin: 0
  },
  lineStyle: {
    backgroundColor: theme.colors.gray,
    height: 1,
    width: 140  
  },
  socialMedia: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 31
  },
  centeredIcon: {
    marginHorizontal: 24,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  }
})

const mapStateToProps = state => ({
  accessToken: state.accessToken,
});


const mapDispatchToProps = dispatch => ({
  saveUserToken: () => dispatch(saveUserToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
