import React, { Component } from 'react';
import { Platform, View, Dimensions, NetInfo, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet, DeviceEventEmitter } from 'react-native';

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import MatrixLoginClient from '../native/MatrixLoginClient';
import { connect } from 'react-redux';
import { isSignedIn } from '../store/actions/loginActions';
import { saveMyUserName } from '../store/actions/contactsActions';

import Logo from '../assets/images/logo-small.svg';
import TextLogo from '../assets/images/text-logo.svg';
import DarkTextLogo from '../assets/images/dark-text-logo.svg';
import Twitter from '../assets/icons/twitter.svg';
import Facebook from '../assets/icons/instagram.svg';
import Instagram from '../assets/icons/facebook.svg';
import TwitterDark from '../assets/icons/twitter-dark.svg';
import FacebookDark from '../assets/icons/facebook-dark.svg';
import InstagramDark from '../assets/icons/instagram-dark.svg';

const { width, height } = Dimensions.get('window');

class Login extends Component {
  static navigationOptions = {
    header: null
  }
  state = {
    email: null,
    password: null,
    errors: [],
    loading: false,
    wrongPassword: false,
  }

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }  

  async checkInternetStatus() {
    const netStatus = await NetInfo.fetch()
  }

  handleLogin = () => {
    const { email, password } = this.state;
    const errors = [];
    const homeserverUri = 'https://matrix.moonshard.tech';
    const identityUri = 'https://vector.im';

    Keyboard.dismiss();
    this.setState({ loading: true });

    if (!email) errors.push('email');
    if (!password) errors.push('password');

    // FIXME
    /*if (email !== null) {
      if (!this.validateEmail(email)) {
          errors.push('email');
      }
    }*/

    if (this.checkInternetStatus === 'none' || this.checkInternetStatus === 'NONE') {
      errors.push('internet')
    }

    this.setState({ errors, loading: false });

    var error = null
    
    if (!errors.length) {
      if (Platform.OS === 'android') {
        const promise  =  MatrixLoginClient.login(
          homeserverUri,
          identityUri,
          email,
          password,
        )  
        promise.then((data) => {
        Alert.alert(
          'Success!',
          'Your login was successful',
          [
          {
              text: 'Continue', onPress: () => {
                this.props.navigation.navigate('SignedIn');
                this.props.loginResult(true)
                this.props.saveMyName(this.state.email)
              }
          }
          ],
          { cancelable: false }
        )  
        console.log(data)
        },
        (error) => {
          if (error = "Error: Invalid password") {
            this.setState({wrongPassword: true})
          }
        console.log(error);
        }
        );          
      }
    }
    
    if (error != null) {
      Alert.alert(
          'Error!',
          'Error occured: ' + error,
          [
          {
            text: 'OK', onPress: () => {}
          }
          ],
          { cancelable: false }
      );
    }
  }


  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  render() {
    const { navigation } = this.props;
    const { loading, errors, wrongPassword } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 100;

    return (
      <KeyboardAvoidingView style={this.props.appState.nightTheme ? styles.darkLogin : styles.login} behavior="padding">
      <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
      >
      <Block padding={[height / 10, theme.sizes.base * 2]}>
          <View style={styles.imageContainer}>
            <Logo width={width / 6.7} height={height / 6.7} />
            {
              this.props.appState.nightTheme 
              ?
              <DarkTextLogo style={styles.textLogo}/>
              :
              <TextLogo style={styles.textLogo}/>
            }
          </View>
          <Text headline semibold center style={this.props.appState.nightTheme ? {color: theme.colors.white} : {color:  theme.colors.notBlack}}>Login</Text>
          <Block middle style={styles.formContainer}>
            <Input
              email
              error={hasErrors('email')}
              style={this.props.appState.nightTheme ? [styles.darkInput, hasErrors('email')] : [styles.input, hasErrors('email')]}
              defaultValue={this.state.email}
              placeholder={'Enter your username'} // FIXME
              placeholderTextColor={this.props.appState.nightTheme ? theme.colors.lightGray : theme.colors.gray}
              onChangeText={text => this.setState({ email: text })}
            />
            {
              wrongPassword 
              ?
              <Input
                secure
                error={hasErrors('password')}
                style={this.props.appState.nightTheme ? [styles.darkWrongInput, hasErrors('password')] : [styles.wrongInput, hasErrors('password')]}
                defaultValue={this.state.password}
                placeholder={'Enter password'}
                placeholderTextColor={this.props.appState.nightTheme ? theme.colors.lightGray : theme.colors.gray}

                onChangeText={text => this.setState({ password: text })}
              />
              :
              <Input
              secure
              error={hasErrors('password')}
              style={this.props.appState.nightTheme ? [styles.darkInput, hasErrors('password')] : [styles.input, hasErrors('password')]}
              defaultValue={this.state.password}
              placeholder={'Enter password'}
              placeholderTextColor={this.props.appState.nightTheme ? theme.colors.lightGray : theme.colors.gray}
              onChangeText={text => this.setState({ password: text })}
            />
            }
            {
              wrongPassword
              ?
              <Text
                red
                footnote
                center
              >Wrong password. Try again.</Text>
              :
              null
            }
            <Button gradient style={styles.confirmButton}               
              onPress={this.handleLogin}
            >
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text headline bold white center>Confirm</Text>
              }
            </Button>
            {
              wrongPassword
              ?
              <Text
                style={{textDecorationLine: 'underline'}}
                gray
                footnote
                center
                onPress={() => navigation.navigate('ForgotPassword')}>
                Forgot Password?</Text>
              :
              null
            }
            <Button style={this.props.appState.nightTheme ? styles.darkTextButton : styles.textButton} onPress={() => navigation.navigate('SignUp')}>
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
            {
              this.props.appState.nightTheme 
              ?
              <TwitterDark width={48} height={48} />
              :
              <Twitter width={48} height={48} />
            }
            {
              this.props.appState.nightTheme 
              ?
              <FacebookDark width={48} height={48} style={styles.centeredIcon}/>
              :
              <Facebook width={48} height={48} style={styles.centeredIcon}/>
            }
            {
              this.props.appState.nightTheme 
              ?
              <InstagramDark width={48} height={48} />
              :
              <Instagram width={48} height={48} />
            }
            </View>
          </Block>
        </Block>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.blueBackground,
  },
  darkLogin: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.notBlack,
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
    backgroundColor: theme.colors.lightGray,
    borderRadius: 8,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'normal',
    margin: 0,
    color: theme.colors.notBlack,
  },
  darkInput: {
    borderWidth: 0,
    backgroundColor: theme.colors.gray,
    borderRadius: 8,
    fontSize: 17,
    textAlign: 'center',
    fontWeight: 'normal',
    margin: 0,
    color: theme.colors.white,
  },
  wrongInput: {
    borderWidth: 0,
    backgroundColor: theme.colors.lightGray,
    borderRadius: 8,
    fontSize: 17,
    textAlign: 'center',
    margin: 0,
    color: '#FF6161',
  },
  darkWrongInput: {
    borderWidth: 0,
    backgroundColor: theme.colors.gray,
    borderRadius: 8,
    fontSize: 17,
    textAlign: 'center',
    margin: 0,
    color: '#FF6161',
  },
  confirmButton: {
    marginTop: 15,
  },
  textButton: {
    marginTop: 36,
    backgroundColor: theme.colors.blueBackground,
  },
  darkTextButton: {
    marginTop: 36,
    backgroundColor: theme.colors.notBlack,
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
    login: state.login,
    appState: state.appState,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loginResult: (data) => dispatch(isSignedIn(data)),
    saveMyName: (data) => dispatch(saveMyUserName(data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)