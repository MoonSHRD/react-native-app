import React, { Component } from 'react';
import { Platform, Dimensions, Alert, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import MatrixLoginClient from '../native/MatrixLoginClient';

import Icon from 'react-native-vector-icons/Ionicons';
import { Block, Text, Switch } from '../components';
import { theme } from '../constants';
import { Slider } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

export default class Settings extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text notBlack style={{fontSize: 14, fontWeight: '600', letterSpacing: -0.0241176}}>Settings</Text>
      ),
      headerRight: (
        <Icon
          name="ios-person" 
          size={24} 
          color={theme.colors.blue}
          onPress={() => navigation.navigate('Profile')}
          style={{paddingVertical: 10, paddingHorizontal: 20,}}
        />
      ),  
    }
  };
  state = {
    notifications: true,
    nightTheme: false,
    textSize: 0.3,
  }

  handleSignOut = () => {
    if (Platform.OS === 'android') {
      MatrixLoginClient.logout()  
    }
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors, notifications, nightTheme, textSize } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 100;

    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
        >
        <Block style={styles.settings}>
          <Text headline bold notBlack style={{marginTop: 20, marginBottom: 8}}>General settings</Text>
          <Block row space="between" style={styles.settingsItem}>
            <Text body notBlack>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={value => this.setState({ notifications: value })}
            />
          </Block>
          <Block row space="between" style={styles.settingsItem}>
            <Text body notBlack>Night theme</Text>
            <Switch
              value={nightTheme}
              onValueChange={value => this.setState({ nightTheme: value })}
            />
          </Block>
          <Block row space="between" style={styles.settingsItem}>
            <Text body notBlack>Language</Text>
            <Text body gray>English</Text>
          </Block>
          <Text headline bold notBlack style={{marginTop: 23, marginBottom: 8}}>Chat settings</Text>
          <Block 
            forPress
            row 
            space="between" 
            style={styles.settingsItem}
            onPress={() => navigation.navigate('ChatBackground')}
          >
            <Text body notBlack>Chat Background</Text>
            <Icon
              name="ios-arrow-forward" 
              size={24} 
              color={theme.colors.gray}
              style={{paddingHorizontal: 8}}
              onPress={() => navigation.navigate('ChatBackground')}
            />
          </Block>
          <Text headline bold notBlack style={{marginTop: 23, marginBottom: 8}}>Text size</Text>
          <Block row space="between" style={styles.settingsItem}>
            <Text notBlack style={{fontSize: 11}}>A</Text>
            <Slider
              value={textSize}
              maximumValue={1}
              minimumValue={0}
              step={0.1}
              style={styles.slider}
              thumbTintColor={theme.colors.notBlack}
              thumbTouchSize={{width:16, height: 16}}
              trackStyle={{borderColor: theme.colors.blue}}
              onValueChange={value => this.setState({ textSize: value })}
            />
            <Text notBlack style={{fontSize: 20}}>A</Text>
          </Block>
          <Text headline bold notBlack style={{marginTop: 23, marginBottom: 8}}>Other</Text>
          <Block 
            forPress
            row 
            space="between" 
            style={styles.settingsItem}
          >
            <Text body notBlack>FAQ</Text>
            <Icon
              name="ios-arrow-forward" 
              size={24} 
              color={theme.colors.gray}
              onPress={() => {Alert.alert('!')}}
              style={{paddingHorizontal: 8}}
            />
          </Block>
          <Block 
            row 
            forPress
            space="between" 
            style={styles.settingsItem}
            onPress={this.handleSignOut}
          >
            <Text body red>Log Out</Text>
          </Block>
        </Block>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  settings: {
    width: width,
    paddingHorizontal: 16,
  },
  settingsItem: {
    paddingVertical: 10,
    borderBottomColor: theme.colors.lightGray,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  slider: {
    width: width - 76,
  }
})