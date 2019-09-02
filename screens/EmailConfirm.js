import React, { Component } from 'react';
import { View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';
import Logo from '../assets/images/logo-small.svg';
import TextLogo from '../assets/images/text-logo.svg';
import DarkTextLogo from '../assets/images/dark-text-logo.svg';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

class EmailConfirm extends Component {
  static navigationOptions = {
    header: null
  }
  state = {
    email: null,
    errors: [],
    loading: false,
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={this.props.appState.nightTheme ? styles.darkContainer : styles.container} behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
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
          <Text headline semibold center style={this.props.appState.nightTheme ? {color: theme.colors.white} : {color:  theme.colors.notBlack}}>Confirm your email</Text>
          <Text gray footnote center style={{marginTop: 14}}>We just need your email address to confirm your registration</Text>
          <Block middle style={styles.formContainer}>
            <Input
              email
              error={hasErrors('email')}
              style={this.props.appState.nightTheme ? [styles.darkInput, hasErrors('email')] : [styles.input, hasErrors('email')]}
              defaultValue={this.state.email}
              placeholder={'Enter your email'}
              placeholderTextColor={this.props.appState.nightTheme ? theme.colors.lightGray : theme.colors.gray}
              onChangeText={text => this.setState({ email: text })}
            />
            <Button gradient style={styles.confirmButton} onPress={() => navigation.navigate('SignedIn')}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text headline bold white center>Confirm</Text>
              }
            </Button>
          </Block>
        </Block>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.blueBackground,
  },
  darkContainer: {
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
    backgroundColor: '#EBEBEB',
    borderRadius: 8,
    fontSize: 17,
    textAlign: 'center',
    margin: 0,
    color: '#333333',
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
    appState: state.appState,
  }
}

export default connect(
  mapStateToProps,
)(EmailConfirm)