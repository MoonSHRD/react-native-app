import React, { Component } from 'react';
import { Platform, Dimensions, Alert, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import MatrixLoginClient from '../native/MatrixLoginClient';
import { connect } from 'react-redux';
import { logout } from '../store/actions/loginActions';
import { setNotifications, setNightTheme, setTextSize } from '../store/actions/appStateActions';

import Icon from 'react-native-vector-icons/Ionicons';
import { Block, Text, Switch, Button } from '../components';
import { theme } from '../constants';
import { Slider } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

class Settings extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text style={
          navigation.getParam('nightTheme') 
          ?
          styles.darkHeaderText
          :
          styles.headerText
        }
        >
          Settings</Text>
      ),
      headerRight: (
        <Icon
          name="ios-person" 
          size={24} 
          color={
            navigation.getParam('nightTheme') 
            ?
            theme.colors.white
            :
            theme.colors.blue
          }
          onPress={() => navigation.navigate('Profile')}
          style={{paddingVertical: 10, paddingHorizontal: 20,}}
        />
      ),  
      headerStyle:  {
        backgroundColor: navigation.getParam('nightTheme') ? theme.colors.notBlack : theme.colors.white
      }
    }
  };
  state = {
    notifications: true,
    nightTheme: false,
    textSize: 0.3,
    screenHeight: height,
  }

  handleSignOut = () => {
      MatrixLoginClient.logout()
      this.props.confirmLogout()
  }

  setHeaderParams = () => {
    this.props.navigation.setParams({nightTheme: this.props.appState.nightTheme});  
  }

  componentDidMount = () => {
    this.setHeaderParams()
    }

  componentDidUpdate(prevProps) {
    if (prevProps.appState.nightTheme !== this.props.appState.nightTheme) {
      this.setHeaderParams()
    }  
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 100;

    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
        >
        <Block style={this.props.appState.nightTheme ? styles.darkSettings : styles.settings}>
          <Text headline bold style={this.props.appState.nightTheme ? styles.whiteTextMargin : styles.notBlackTextMargin}>General settings</Text>
          <Block row space="between" style={this.props.appState.nightTheme ? styles.darkSettingsItem: styles.settingsItem}>
            <Text body style={this.props.appState.nightTheme ? styles.whiteText : styles.notBlackText}>Notifications</Text>
            <Switch
              value={this.state.notifications}
              onValueChange={(value) => {
                this.setState({notifications: value})
              }}
            />
          </Block>
          <Block row space="between" style={this.props.appState.nightTheme ? styles.darkSettingsItem: styles.settingsItem}>
            <Text body style={this.props.appState.nightTheme ? styles.whiteText : styles.notBlackText}>Night theme</Text>
            <Switch
              value={this.state.nightTheme}
              onValueChange={(value) => {
                this.setState({nightTheme: value})
              }}
            />
          </Block>
          <Block row space="between" style={this.props.appState.nightTheme ? styles.darkSettingsItem: styles.settingsItem}>
            <Text body style={this.props.appState.nightTheme ? styles.whiteText : styles.notBlackText}>Language</Text>
            <Text body gray>English</Text>
          </Block>
          <Text headline bold style={this.props.appState.nightTheme ? styles.itemDarkText : styles.itemText}>Chat settings</Text>
          <Block 
            forPress
            row 
            space="between" 
            style={this.props.appState.nightTheme ? styles.darkSettingsItem: styles.settingsItem}
            onPress={() => navigation.navigate('ChatBackground')}
          >
            <Text body style={this.props.appState.nightTheme ? styles.whiteText : styles.notBlackText}>Chat Background</Text>
            <Icon
              name="ios-arrow-forward" 
              size={24} 
              color={theme.colors.gray}
              style={{paddingHorizontal: 8}}
              onPress={() => navigation.navigate('ChatBackground')}
            />
          </Block>
          <Text headline bold style={this.props.appState.nightTheme ? styles.itemDarkText : styles.itemText}>Text size</Text>
          <Block row space="between" style={this.props.appState.nightTheme ? styles.darkSettingsItem: styles.settingsItem}>
            <Text style={this.props.appState.nightTheme ? styles.grayText : styles.notBlackText} style={{fontSize: 11}}>A</Text>
            <Slider
              value={this.props.appState.textSize}
              maximumValue={1}
              minimumValue={0}
              step={0.1}
              style={styles.slider}
              thumbTintColor={this.props.appState.nightTheme ? theme.colors.white : theme.colors.notBlack}
              thumbTouchSize={{width:16, height: 16}}
              trackStyle={{borderColor: theme.colors.blue}}
              onValueChange={value => this.props.setTextSize(value)}
            />
            <Text style={this.props.appState.nightTheme ? styles.grayText : styles.notBlackText} style={{fontSize: 20}}>A</Text>
          </Block>
          <Text headline bold style={this.props.appState.nightTheme ? styles.itemDarkText : styles.itemText}>Other</Text>
          <Block 
            forPress
            row 
            space="between" 
            style={this.props.appState.nightTheme ? styles.darkSettingsItem: styles.settingsItem}
          >
            <Text body style={this.props.appState.nightTheme ? styles.whiteText : styles.notBlackText}>FAQ</Text>
            <Icon
              name="ios-arrow-forward" 
              size={24} 
              color={theme.colors.gray}
              onPress={() => {Alert.alert('!')}}
              style={{paddingHorizontal: 8}}
            />
          </Block>
          {
            Platform.OS === 'android' 
            ?
            <Button onPress={this.handleSignOut} style={this.props.appState.nightTheme ? styles.darkSettingsButton: styles.settingsButton}>
              <Text body red>Log Out</Text>
            </Button>
            :
            <Block 
              row 
              forPress
              space="between" 
              style={this.props.appState.nightTheme ? styles.darkSettingsItem: styles.settingsItem}
              onPress={this.handleSignOut}
            >
              <Text body red>Log Out</Text>
            </Block>
          }
        </Block>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  settings: {
    width: width,
  },
  darkSettings: {
    width: width,
    backgroundColor: theme.colors.black,
  },
  headerText: {
    fontSize: 14, 
    fontWeight: '600', 
    letterSpacing: -0.0241176,
    color: theme.colors.notBlack,
  },
  darkHeaderText: {
    fontSize: 14, 
    fontWeight: '600', 
    letterSpacing: -0.0241176,
    color: theme.colors.white,
  },
  settingsItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: theme.colors.lightGray,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  darkSettingsItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: theme.colors.black,
    borderBottomWidth: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.notBlack,
  },
  settingsButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: theme.colors.lightGray,
    borderBottomWidth: 1,
    marginVertical: 0,
  },
  darkSettingsButton: {
    marginVertical: 0,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: theme.colors.black,
    borderBottomWidth: 1,
    backgroundColor: theme.colors.notBlack,
  },
  notBlackText: {
    color: theme.colors.notBlack,
  },
  notBlackTextMargin: {
    marginTop: 20, 
    marginBottom: 8,
    color: theme.colors.notBlack,
    paddingHorizontal: 16,
  },
  grayText: {
    color: theme.colors.gray,
  },
  whiteText: {
    color: theme.colors.white,
  },
  whiteTextMargin: {
    marginTop: 20, 
    marginBottom: 8,
    color: theme.colors.white,
    paddingHorizontal: 16,
  },
  itemText: {
    marginTop: 23, 
    marginBottom: 8,
    color: theme.colors.notBlack,
    paddingHorizontal: 16,
  },
  itemDarkText: {
    marginTop: 23, 
    marginBottom: 8,
    color: theme.colors.white,
    paddingHorizontal: 16,
  },
  slider: {
    width: width - 76,
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
    confirmLogout: () => dispatch(logout()),
    setNotifications: (data) => dispatch(setNotifications(data)),
    setNightTheme: (data) => dispatch(setNightTheme(data)),
    setTextSize: (data) => dispatch(setTextSize(data)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)