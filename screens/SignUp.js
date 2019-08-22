import React, { Component } from 'react';
import { Platform, View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet, DeviceEventEmitter } from 'react-native';

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import MatrixLoginClient from '../native/MatrixLoginClient';
import { connect } from 'react-redux';
import { isSignedIn } from '../store/actions/loginActions';

import Logo from '../assets/images/logo-small.svg';
import TextLogo from '../assets/images/text-logo.svg';
import Twitter from '../assets/icons/twitter.svg';
import Facebook from '../assets/icons/instagram.svg';
import Instagram from '../assets/icons/facebook.svg';

const { width, height } = Dimensions.get('window');

class SignUp extends Component {
  static navigationOptions = {
    header: null
  }
  state = {
    email: null,
    password: null,
    errors: [],
    loading: false,
    loginResult: {},
    userAlreadyExist: false,
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }  

  async checkInternetStatus() {
    const netStatus = await NetInfo.fetch()
  }

  handleSignUp = () => {
    const { email, password, userAlreadyExist } = this.state;
    const errors = [];
    const homeserverUri = 'https://matrix.moonshard.tech';
    const identityUri = 'https://vector.im'

    Keyboard.dismiss();
    this.setState({ loading: true });
    console.log('button pressed')

    // check with backend API or with some static data
    if (!email) errors.push('email');
    if (!password) errors.push('password');
    if (this.checkInternetStatus === 'none' || this.checkInternetStatus === 'NONE') {
      errors.push('internet')
    }
 
    // FIXME
    /*if (email !== null) {
      if (!this.validateEmail(email)) {
          errors.push('email');
      }
    }*/

    this.setState({ errors, loading: false });

    var error = null
    
    if (!errors.length) {
      if (Platform.OS === 'android') {
        MatrixLoginClient.register(
          homeserverUri,
          identityUri,
          email,
          password,
        )  
      }
      
      if (userAlreadyExist) {
          Alert.alert(
            'Error!',
            'User already exist',
            [
            {
                text: 'OK', onPress: () => {
                  this.props.confirmLogin(false)
                }
            }
            ],
            { cancelable: false }
        )
      }
    }
  }

  componentDidMount() {		
    const { confirmLogin } = this.props;	
    this.onRegistrationSuccess = DeviceEventEmitter.addListener('onRegistrationSuccess', function(e) {
      console.log('onRegistrationSuccess')
      console.log(e)
      Alert.alert(
        'Success!',
        'Your registration was successful',
        [
        {
            text: 'Continue', onPress: () => {
              confirmLogin(true)
            }
        }
        ],
        { cancelable: false }
      )
    });  	
    this.onRegistrationFailed = DeviceEventEmitter.addListener('onRegistrationFailed', (e) => {
      console.log('onRegistrationFailed')
      console.log(e)
      this.setState({userAlreadyExist: true})
    });  
    this.onThreePidRequestFailed = DeviceEventEmitter.addListener('onThreePidRequestFailed', function(e) {
      console.log('onThreePidRequestFailed')
      console.log(e)
      console.log(event)		
    });  
    this.onResourceLimitExceeded = DeviceEventEmitter.addListener('onResourceLimitExceeded', function(e) {
      console.log('onResourceLimitExceeded')
      console.log(e)
      console.log(event)		
    });  
  }		

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 100;

    return (
      <KeyboardAvoidingView style={styles.signup} behavior="padding">
        <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={scrollEnabled}
            onContentSizeChange={this.onContentSizeChange}
        >
        <Block padding={[height / 10, theme.sizes.base * 2]}>
          <View style={styles.imageContainer}>
            <Logo width={width / 6.7} height={height / 6.7} />
            <TextLogo style={styles.textLogo}/>
          </View>
          <Text headline semibold center>Register</Text>
          <Block middle style={styles.formContainer}>
            <Input
              email
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              defaultValue={this.state.email}
              placeholder={'Enter your username'} // FIXME
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
              onPress={this.handleSignUp}
            >
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text headline bold white center>Confirm</Text>
              }
            </Button>
            <Button style={styles.textButton} onPress={() => navigation.navigate('Login')}>
              <Text gray footnote center>
                Already have an account? <Text gray footnote style={{ textDecorationLine: 'underline' }}>Login</Text>
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

function mapStateToProps (state) {
  return {
    login: state.login
  }
}

function mapDispatchToProps (dispatch) {
  return {
    confirmLogin: (data) => dispatch(isSignedIn(data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp)