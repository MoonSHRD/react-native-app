import React, { Component } from 'react';
import { Platform, Dimensions, Alert, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import MatrixLoginClient from '../native/MatrixLoginClient';
import { connect } from 'react-redux';
import { logout } from '../store/actions/loginActions';
import { setNotifications, setNightTheme, setTextSize } from '../store/actions/appStateActions';

import Icon from 'react-native-vector-icons/Ionicons';
import { Block, Text, Switch, Button } from '../components';
import { theme } from '../constants';
import { Overlay, Avatar, Slider } from 'react-native-elements';
import { setMatchedUser, setVisible } from '../store/actions/p2chatActions';


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
    const {setMatchedUser} = this.props
    this.setHeaderParams()
    this.NewMatchEvent = DeviceEventEmitter.addListener('NewMatchEvent', async (e) => {
      await console.log(e)
      data = await e.match
      jsonData = await JSON.parse(data)
      await console.log('NewMatchEvent')
      await setMatchedUser(jsonData)
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.appState.nightTheme !== this.props.appState.nightTheme) {
      this.setHeaderParams()
    }  
  }

  goToChatScreen = async (navigation) => {
    if (this.props.p2chat.matchedUser.userModel.roomId != null) {
        roomId = this.props.p2chat.matchedUser.userModel.roomId
        await this.props.navigation.navigate('Chat', {
            userName: this.capitalize(this.props.p2chat.matchedUser.userModel.name),
            userIdName: this.parseUserId(this.props.p2chat.matchedUser.userModel.userId),
            userId: this.props.p2chat.matchedUser.userModel.userId,
            avatarUrl: this.props.p2chat.matchedUser.userModel.avatarUrl,
            avatarLink: this.parseAvatarUrl(this.props.p2chat.matchedUser.userModel.avatarUrl),
            isActive: this.props.p2chat.matchedUser.userModel.isActive,
            lastSeen: this.props.p2chat.matchedUser.userModel.lastSeen,
            roomId: roomId
        })        
    } else {
        userId = this.props.p2chat.matchedUser.userModel.userId
        const promise = MatrixClient.createDirectChat(userId)
        promise.then(async (data) => {
            await console.log(data)
            await this.props.navigation.navigate('Chat', {
                userName: this.capitalize(this.props.p2chat.matchedUser.userModel.name),
                userIdName: this.parseUserId(this.props.p2chat.matchedUser.userModel.userId),
                userId: this.props.p2chat.matchedUser.userModel.userId,
                avatarUrl: this.props.p2chat.matchedUser.userModel.avatarUrl,
                avatarLink: this.parseAvatarUrl(this.props.p2chat.matchedUser.userModel.avatarUrl),
                isActive: this.props.p2chat.matchedUser.userModel.isActive,
                lastSeen: this.props.p2chat.matchedUser.userModel.lastSeen,
                roomId: data
            })
          },
          (error) => {
            console.log(error);
          }
        )    
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
        {
          this.props.p2chat.isVisible 
          ?
            <Overlay 
              isVisible
              onBackdropPress={()=>this.props.setVisible(false)}
              overlayStyle={styles.overlayContainer}
              borderRadius={16}
              height="auto"
            >
                <Block style={styles.overlayAvatarContainer}>
                {
                  this.props.p2chat.matchedUser.userModel.avatarUrl == ''
                  ?
                  <Avatar 
                    rounded
                    title={this.capitalize(this.props.p2chat.matchedUser.userModel.name[0])}
                    titleStyle={{fontSize:36}}
                    containerStyle={styles.overlayAvatar}
                    avatarStyle={styles.overlayAvatarImage}
                  />
                  :
                  <Avatar 
                    rounded
                    source={{
                        uri:
                        this.parseAvatarUrl(this.props.p2chat.matchedUser.userModel.avatarUrl),
                    }}
                    containerStyle={styles.overlayAvatar}
                    avatarStyle={styles.overlayAvatarImage}
                  />
                }
                </Block>
                <View style={{paddingHorizontal:14, marginTop: 42}}>
                <Text center h3 notBlack bold style={{marginTop:20, marginHorizontal: 14}}>{this.props.p2chat.matchedUser.userModel.name}</Text>
                <Text center subhead notBlack style={{marginTop:8, marginHorizontal: 20}}>You have a match by {this.props.p2chat.matchedUser.userModel.topics.length > 1 ? <Text>{this.props.p2chat.matchedUser.userModel.topics.length} tags</Text> : <Text>{this.props.p2chat.matchedUser.userModel.topics.length} tag</Text>}</Text>
                <Block style={styles.overlayTagContainer}>
                  {
                    this.props.p2chat.matchedUser.userModel.topics.map((l,i) => (
                              <Button
                                  key={i}
                                  style={styles.overlayMatchedTag}>
                                  <Text caption white center>{l}</Text>
                              </Button>
                      ))
                  }
                </Block>
                <Block style={styles.overlayButtonContainer}>
                  <Button style={styles.overlayCloseButton}               
                      onPress={()=>this.props.setVisible(false)}
                  >
                    <Text headline bold blue center>Close</Text>
                  </Button>
                  <Button gradient style={styles.overlayConfirmButton}               
                      onPress={() => this.goToChatScreen()}
                  >
                    <Text headline bold white center>Send message</Text>
                  </Button>       
                </Block>
                </View>
            </Overlay>
          :
          null
        }          
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
  },
  overlayContainer: {
    marginHorizontal: 64,
    paddingBottom: 15.67,
    paddingHorizontal: 0,
    flexDirection: 'column',
    alignSelf: 'center',
  },
  overlayAvatarContainer: {
    alignSelf: 'center',
    position: 'absolute',
    top: -55
  },
  overlayAvatar: {
      width: 110,
      height: 110,
      borderRadius: 50,
      overflow: 'hidden',
      borderColor: 'white',
      borderStyle: 'solid',
      borderWidth: 3,
  },
  overlayTagContainer: {
    flex:0,
    flexDirection: "row",
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginTop: 12,
  },  
  overlayMatchedTag: {
    backgroundColor: theme.colors.blue,
    borderRadius: 16,
    overflow: 'hidden',
    height: 24,
    paddingVertical: 4,
    paddingHorizontal: 16,
    marginHorizontal: 2,
  },
  overlayButtonContainer: {
    flex: 0,
    marginTop:15.67,
  },
  overlayCloseButton: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.blue,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden'
  },
})

function mapStateToProps (state) {
  return {
    login: state.login,
    appState: state.appState,
    p2chat: state.p2chat,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    confirmLogout: () => dispatch(logout()),
    setNotifications: (data) => dispatch(setNotifications(data)),
    setNightTheme: (data) => dispatch(setNightTheme(data)),
    setTextSize: (data) => dispatch(setTextSize(data)),
    setMatchedUser: (data) => dispatch(setMatchedUser(data)),
    setVisible: (data) => dispatch(setVisible(data)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings)