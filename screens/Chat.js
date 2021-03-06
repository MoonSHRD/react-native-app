import React, { Component } from 'react';
import { Text, Dimensions, StyleSheet, Platform, View, DeviceEventEmitter } from 'react-native';

import { Block } from '../components';
import { Avatar, Badge, Icon } from 'react-native-elements';
import { GiftedChat, Actions, Send, InputToolbar, Composer, GiftedAvatar } from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import TimeAgo from 'react-native-timeago';
import { theme } from '../constants';  
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import { getDirectChatHistory, updateDirectChatHistory, sendMessage, handleMessageChange, pushNewMessageSuccess, pushNewMessage, pushNewMessageToHistory, resetNewMessage, setNewMessage } from '../store/actions/chatActions';
import { getMyUserId } from '../store/actions/contactsActions';
const { width, height } = Dimensions.get('window');


class Chat extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const userName = navigation.getParam('userName', '')
        const userIdName = navigation.getParam('userIdName', '')
        const userId = navigation.getParam('userId', 'userId')
        const isActive = navigation.getParam('isActive')
        const lastSeen = navigation.getParam('lastSeen')
        const avatarUrl = navigation.getParam('avatarUrl', '')
        const avatarLink = navigation.getParam('avatarLink', '')
        const previousScreen = navigation.getParam('previousScreen', '')
        return {
            headerTitle: (
                <Block style={styles.userContainer}>
                  {
                    userName != ''
                    ?
                      avatarUrl != ''
                        ? 
                        <Avatar 
                            source={{uri: avatarLink }}
                            containerStyle={styles.avatar}
                            avatarStyle={styles.avatarImage}
                        />
                        :
                        <Avatar 
                            containerStyle={styles.avatar}
                            avatarStyle={styles.avatarImage}
                            titleStyle={{fontSize: 12}}
                            title={userName[0]}
                          />
                    :
                    avatarUrl != ''
                      ? 
                      <Avatar 
                          source={{uri: avatarLink }}
                          containerStyle={styles.avatar}
                          avatarStyle={styles.avatarImage}
                      />
                      :
                      <Avatar 
                          containerStyle={styles.avatar}
                          avatarStyle={styles.avatarImage}
                          titleStyle={{fontSize: 12}}
                          title={userName[0]}
                        />
                  }
                    <Block style={styles.nameContainer}>
                      {
                        userName != ''
                        ?
                        <Text style={styles.userNameText}>{userName}</Text>
                        :
                        <Text style={styles.userNameText}>{userIdName}</Text>
                      }
                        <Block styles={styles.statusContainer}>
                            {
                                isActive == true
                                ?
                                <Block>
                                <Badge 
                                    containerStyle={styles.userBadge}
                                    badgeStyle={{height: 8, width: 8}}
                                    status="primary"
                                    />
                                <Text style={styles.onlineStatusText}>Online</Text>
                                </Block>
                                :
                                <Text style={styles.statusText}>Last seen <TimeAgo time={lastSeen} interval={60000}/></Text>
                            }
                        </Block>
                    </Block>
                </Block>
            ),
            headerLeft: 
            (
                <Icon
                    name="ios-arrow-back" 
                    type='ionicon'
                    size={24} 
                    color={
                        navigation.getParam('nightTheme') 
                        ?
                        theme.colors.white
                        :
                        theme.colors.blue
                      }
                        onPress={
                          previousScreen == 'NewChat'
                          ?
                          () => {
                            navigation.navigate('ChatList')
                            console.log('sss')
                          }
                          :
                          () => navigation.goBack()
                        }
                    containerStyle={{paddingVertical: 10, paddingHorizontal: 20,}}
                />
              ),
            headerRight: (
                <Icon
                    name="ios-more" 
                    type='ionicon'
                    size={24} 
                    color={
                        navigation.getParam('nightTheme') 
                        ?
                        theme.colors.white
                        :
                        theme.colors.blue
                    }
                    onPress={() => {
                        navigation.navigate('Profile', {
                            userName: userName,
                            userIdName: userIdName,
                            userId: userId,
                            avatarLink: avatarLink,
                            previousScreen: 'Chat',
                        })
                    }}  
                    containerStyle={
                        Platform.OS === 'ios'
                        ?
                        {paddingVertical: 10, paddingHorizontal: 20}
                        :
                        {paddingVertical: 10, paddingHorizontal: 20, transform: [{ rotate: '90deg' }]}
                    }
                />
            ),
            headerStyle:  {
                backgroundColor: navigation.getParam('nightTheme') ? theme.colors.notBlack : theme.colors.white
            }
        };
      }    
  state = {
    messages: []
  };

  addNewMessage(newMessage) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, newMessage),
      };
    });
  }


  componentDidMount = async () => {
    const {setMatchedUser} = this.props
      await this.props.getMyUserId()
      await this.getMessageHistory()
      var self = this;
      const { chat, setNewMessage, pushNewMessage, pushNewMessageSuccess, pushNewMessageToHistory, resetNewMessage } = this.props;
      this.eventMessage = DeviceEventEmitter.addListener('eventMessage', function(e) {
        console.log("new message event")
        console.log(e)
        const data = JSON.parse(e.message)
        console.log(data)
        jsonData = JSON.parse(data.event.contentAsString)
        console.log(jsonData)
        const time = new Date()

        var newMessage = new Object()

        newMessage._id = data.event.eventId
        newMessage.text = jsonData.body
        newMessage.createdAt = time - data.event.unsigned.age
        newMessage.status = data.event.mSentState

        var user = new Object()
        newMessage.user = user
        user._id = data.event.sender
        user.name = data.user.name
        user.userId = data.user.userId
        user.avatarUrl = data.user.avatarUrl
        user.roomId = data.event.roomId
        
        if (data.user.avatarUrl != '') {
          let parts = data.user.avatarUrl.split('mxc://', 2);
          let urlWithoutMxc  = parts[1];
          let urlParts = urlWithoutMxc.split('/', 2)
          let firstPart = urlParts[0]
          let secondPart = urlParts[1] 
          let serverUrl = 'https://matrix.moonshard.tech/_matrix/media/r0/download/'
          let avatarLink =  serverUrl + firstPart + '/' + secondPart    
          user.avatar = avatarLink
        }

        console.log(newMessage)

        setNewMessage(newMessage)
        pushNewMessage()
        pushNewMessageSuccess()
        self.addNewMessage(newMessage)
        pushNewMessageToHistory()
        resetNewMessage()
        
      })
    }

  getMessageHistory() {
    const roomId = this.props.navigation.getParam('roomId', '')
    this.props.getDirectChatHistory(roomId, (messages) => {
      console.log(messages)
      const newMessages = messages.messages
      this.setState((previousState) => {
        return {
          messages: GiftedChat.append(previousState.messages, newMessages),
        };
      });
    });
  }

  capitalize(props) {
    let text = props.slice(0,1).toUpperCase() + props.slice(1, props.length);
    return text
  }

  onSend = async () => {
    const {chat, sendMessage, navigation} = await this.props
    const roomId = await navigation.getParam('roomId', '')
    if (chat.newTextMessage != '') {
      await sendMessage(chat.newTextMessage, roomId)
    }
  }

  openActionSheet() {
    var CANCEL_INDEX = 2;
    var BUTTONSiOS = [
        'Choose from Gallery',
        'Take a picture',
        'Cancel'
    ];
    var BUTTONSandroid = [
        'Choose from Gallery',
        'Take a picture',
        'Cancel'
    ];

    ActionSheet.showActionSheetWithOptions({
        options: (Platform.OS == 'ios') ? BUTTONSiOS : BUTTONSandroid,
        cancelButtonIndex: CANCEL_INDEX,
        tintColor: 'blue'
      },
      (buttonIndex) => {
          if (buttonIndex == 0) {
            ImagePicker.openPicker({
              includeBase64:  true,
            }).then(image => {
              this.setState({newMessage: `data:${image.mime};base64,${image.data}`})
              console.log(image);
            });      
          } 
          if (buttonIndex == 1) {
            ImagePicker.openCamera({
              includeBase64:  true,
            }).then(image => {
              this.setState({newMessage: `data:${image.mime};base64,${image.data}`})
                console.log(image);
            });      
          }
        console.log('button clicked :', buttonIndex);
      });      
  }

  renderSend(props) {
    return (
        <Send
            {...props}
        >
                <Icon
                    name="ios-arrow-dropup-circle" 
                    type="ionicon"
                    size={32} 
                    color={theme.colors.blue}
                    containerStyle={{marginRight: 16, marginBottom: 10}}
                />
        </Send>
    );
  }

renderInputToolbar (props) {
   return (
     <InputToolbar {...props} containerStyle={{backgroundColor: 'rgba(244, 246, 255, 0.85)'}} />
   )
}

renderComposer(props) {
  return (
    <View style={{flexDirection: 'row', width: width - 100,marginTop: 8, marginBottom: 8, borderRadius: 16, backgroundColor: theme.colors.white, marginRight:16, marginLeft: 16}}>
      <Composer 
        {...props} 
        textInputStyle={{fontSize:12, paddingHorizontal: 8, lineHeight:16, paddingVertical: 0}}
        composerHeight={32}
        />
    </View>
  );
}

renderCustomActions = props => {
  return (
    <Actions 
      {...props} 
      containerStyle={{width: 28, height: 28, marginLeft: 0, marginBottom: 12}}
      icon={() => {
        return (
          <Icon
            name="ios-attach" 
            type="ionicon"
            size={28} 
            color={theme.colors.blue}
            containerStyle={{marginLeft: 16}}
          />
        )
      }}
    />
  )
}

isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
  const paddingToTop = 80;
  return contentSize.height - layoutMeasurement.height - paddingToTop <= contentOffset.y;
}

loadPreviousMessages = async () => {
  const roomId = await this.props.navigation.getParam('roomId', '')
  await this.setState({refreshing: true});
  await this.props.updateDirectChatHistory(roomId, this.props.chat.end);
  const newMessages = this.props.chat.newMessageHistory.messages;
  await this.setState((previousState) => {
    return {
      messages: GiftedChat.prepend(previousState.messages, newMessages),
    };
  });
  await console.log('loaded')
}


  render() {
    const myUserId = this.props.contacts.myUserID

    return (
      <GiftedChat
        text={this.props.chat.newTextMessage}
        onInputTextChanged={text => this.props.handleMessageChange(text)}    
        messages={this.state.messages}
        onSend={this.onSend}
        listViewProps={{
          scrollEventThrottle: 400,
          onScroll: ({ nativeEvent }) => {
            if (this.isCloseToTop(nativeEvent)) {
              this.loadPreviousMessages()
            }
          },
        }}
        // loadEarlier={this.state.refreshing}
        placeholder={'Type Message Here'}
        renderSend={this.renderSend}
        onPressAvatar={(user) => {
          console.log(user)
          this.props.navigation.navigate('Profile', {
            userName: user.name,
            userId: user.userId,
            userIdName: user.name,
            avatarLink: user.avatar,
            roomId: user.roomId,
            from: 'chat',
          })
        }}
        renderActions={this.renderCustomActions}
        onPressActionButton={this.openActionSheet}
        renderComposer={this.renderComposer}
        renderInputToolbar={this.renderInputToolbar} 
        minInputToolbarHeight={48}
        alwaysShowSend={true}
        user={{
          _id: myUserId,
        }}
      />
    )
  }
}

const styles = StyleSheet.create({
    userNameText: {
        fontSize: 14, 
        lineHeight: 24,
        fontWeight: '600', 
        letterSpacing: -0.0241176,
        color: theme.colors.notBlack,
        position: 'absolute',
        top: -5,
        left: 8,
    },
    darkHeaderText: {
        fontSize: 14, 
        fontWeight: '600', 
        letterSpacing: -0.0241176,
        color: theme.colors.white,
    },
    onlineStatusText: {
        fontSize: 9,
        lineHeight: 16,
        letterSpacing: -0.00615385,
        fontWeight: 'normal',
        position: 'absolute',
        top: 13,
        left: 18,
    },
    statusText: {
        fontSize: 9,
        lineHeight: 16,
        letterSpacing: -0.00615385,
        fontWeight: 'normal',
        position: 'absolute',
        top: 13,
        left: 8,
    },
    userContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        position: 'absolute',
        left: -10
    },
    nameContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    statusContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    avatar: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
        width: 24,
        borderRadius: 50,
        overflow: 'hidden',
    },
    avatarImage: {
        height: 24,
        width: 24,
    },
    userBadge: {
        position: 'absolute',
        top: 17,
        left: 8,
    },
})

function mapStateToProps (state) {
    return {
      contacts: state.contacts,
      appState: state.appState,
      chat: state.chat,
    }
  }

  function mapDispatchToProps (dispatch) {
    return {
      getDirectChatHistory: (roomId, callback) => dispatch(getDirectChatHistory(roomId, callback)),
      updateDirectChatHistory: (roomId, end) => dispatch(updateDirectChatHistory(roomId, end)),
      sendMessage: (message, roomId) => dispatch(sendMessage(message, roomId)),
      handleMessageChange: (text) => dispatch(handleMessageChange(text)),
      getMyUserId: () => dispatch(getMyUserId()),
      setNewMessage: (data) => dispatch(setNewMessage(data)),
      pushNewMessage: () => dispatch(pushNewMessage()),
      pushNewMessageSuccess: () => dispatch(pushNewMessageSuccess()),
      pushNewMessageToHistory: () => dispatch(pushNewMessageToHistory()),
      resetNewMessage: () => dispatch(resetNewMessage()),
      loadMessages: (roomId, callback) => dispatch(loadMessages(roomId, callback)),
    }
  }  
    
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Chat)