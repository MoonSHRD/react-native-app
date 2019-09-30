import React, { Component } from 'react';
import { View, Alert, Platform, Dimensions, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet, Image } from 'react-native';

import { Button, Block, Text } from '../components';
import { theme } from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import { Overlay, Avatar } from 'react-native-elements';

const { width, height } = Dimensions.get('window');
import {connect} from 'react-redux';
import { setChatBackground } from '../store/actions/appStateActions';

class ChatBackground extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text style={
          navigation.getParam('nightTheme') 
          ?
          styles.darkHeaderText
          :
          styles.headerText
        }>
        Chat Background</Text>
      ),
      headerLeft: (
        <Icon
            name="ios-arrow-back" 
            size={24} 
            color={
              navigation.getParam('nightTheme') 
              ?
              theme.colors.white
              :
              theme.colors.blue
            }
              onPress={() => navigation.goBack()}
            style={{paddingVertical: 10, paddingHorizontal: 20,}}
        />
      ),
      headerStyle:  {
        backgroundColor: navigation.getParam('nightTheme') ? theme.colors.notBlack : theme.colors.white
      }
    }
  };
  state = {
    chatBackground: null,
    dataSource: [
        {
            picture_url: require('../assets/backgrounds/photo-1501436513145-30f24e19fcc8.jpg'),
        },
        {
            picture_url: require('../assets/backgrounds/photo-1561616177-3444f0cd052f.jpg'),
        },
        {
            picture_url: require('../assets/backgrounds/photo-1561571994-3c61c554181a.jpg'),
        },
        {
            picture_url: require('../assets/backgrounds/photo-1561454260-8559bd155736.jpg'),  
        },
        {
            picture_url: require('../assets/backgrounds/photo-1561445136-7f9e628bd189.jpg'),
        },
        {
            picture_url: require('../assets/backgrounds/photo-1560940742-43a23e56f1b4.jpg'),  
        },
        {
            picture_url: require('../assets/backgrounds/photo-1560983073-c29bff7438ef.jpg'),
        },
        {
            picture_url: require('../assets/backgrounds/photo-1561056532-2d709f79aa7b.jpg'),
        },
        {
            picture_url: require('../assets/backgrounds/photo-1560528836-2c73fd9c4cfe.jpg'),
        },
        {
            picture_url: require('../assets/backgrounds/photo-1560451090-1f3881d8f9e3.jpg'),  
        },
        {
            picture_url: require('../assets/backgrounds/photo-1560178783-75a464fbdf6b.jpg'),
        },
        {
          picture_url: require('../assets/backgrounds/photo-1565450443120-ea90b0ca5117.jpg'),
        }
    ],
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

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
    const { loading, errors, dataSource } = this.state;
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
          <Block 
            forPress
            row 
            space="between" 
            style={this.props.appState.nightTheme ? styles.darkSettingsItem: styles.settingsItem}
            onPress={() => { Alert.alert('Gallery callback') }}
            >
            <Text 
              body 
              style={this.props.appState.nightTheme ? styles.whiteText : styles.notBlackText}
            >
            Choose from gallery</Text>
          </Block>
          <View style={styles.imageContainer}>
            {
                dataSource.map((l,i) => (
                    <Block
                        forPress
                        style={styles.backgroundBlock}
                    >
                    <Image 
                        source={l.picture_url}
                        style={styles.backgroundPicture}
                    />
                    </Block>
                ))
            }
          </View>
            <Block 
                forPress
                row 
                space="between" 
                style={this.props.appState.nightTheme ? styles.darkLastItem : styles.lastItem}
                onPress={() => navigation.navigate('Settings')}
                >
                <Text 
                  body 
                  style={this.props.appState.nightTheme ? styles.whiteText : styles.notBlackText}
                >Disable background settings</Text>
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
    marginTop: 20,
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
    marginTop: 20,
  },
  darkSettingsItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: theme.colors.black,
    borderBottomWidth: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.notBlack,
    marginTop: 20,
  },
  lastItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: theme.colors.lightGray,
    borderBottomWidth: 1,
    alignItems: 'center',
    marginBottom: 15,
  },
  darkLastItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomColor: theme.colors.black,
    borderBottomWidth: 1,
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: theme.colors.notBlack,
  },
  imageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 7,
      marginBottom: 22,
      paddingHorizontal: 16,
  },
  backgroundBlock: {
    marginVertical: 8,
  },
  backgroundPicture: {
      width: (width / 3) - 15,
      height: 201,
  },
  notBlackText: {
    color: theme.colors.notBlack,
  },
  whiteText: {
    color: theme.colors.white,
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
    appState: state.appState,
    p2chat: state.p2chat,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    setChatBackground: (data) => dispatch(setChatBackground(data)),
    setMatchedUser: (data) => dispatch(setMatchedUser(data)),
    setVisible: (data) => dispatch(setVisible(data)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatBackground)