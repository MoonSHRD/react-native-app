import React, { Component } from 'react';
import { Text, Dimensions, StyleSheet, Platform, View, DeviceEventEmitter } from 'react-native';

import { Block } from '../components';
import { Avatar, Icon } from 'react-native-elements';
import { GiftedChat, Actions, Send, InputToolbar, Composer, GiftedAvatar } from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import TimeAgo from 'react-native-timeago';
import { theme } from '../constants';  
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import { sendMessage, handleMessageChange, getP2ChatMessageHistory, setNewMessage, pushNewMessage, pushNewMessageSuccess, pushNewMessageToHistory, resetNewMessage } from '../store/actions/p2chatActions';
import { getMyUserId } from '../store/actions/contactsActions';
const { width, height } = Dimensions.get('window');


class GroupP2Chat extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const chatName = navigation.getParam('chatName', '')
        return {
            headerTitle: (
                <Block style={styles.userContainer}>
                    <Avatar 
                        containerStyle={styles.avatar}
                        avatarStyle={styles.avatarImage}
                        titleStyle={{fontSize: 12}}
                        title={chatName[0]}
                    />
                    <Block style={styles.nameContainer}>
                        <Text style={styles.userNameText}>{chatName}</Text>
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
                        onPress={() => navigation.goBack()}
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
                        navigation.navigate('P2ChatListMembers', {
                            chatName: chatName,
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
      this.NewMessageEvent = DeviceEventEmitter.addListener('NewMessageEvent', function(e) {
        console.log(e)
        const data = e.message
        const jsonData = JSON.parse(data)
        const time = new Date()

        var newMessage = new Object()

        newMessage._id = jsonData.Id
        newMessage.text = jsonData.body
        newMessage.createdAt = time - jsonData.Timestamp

        var user = new Object()
        newMessage.user = user
        user._id = jsonData.fromMatrixID
        user.name = jsonData.User.name
        user.userId = jsonData.User.userId
        user.avatarUrl = jsonData.User.avatarUrl
        user.roomId = jsonData.User.roomId

        if (jsonData.User.avatarUrl != '') {
          let parts = jsonData.User.avatarUrl.split('mxc://', 2);
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
      const chatName = this.props.navigation.getParam('chatName', '')
      this.props.getP2ChatMessageHistory(chatName, (messages) => {
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
    const {p2chat, sendMessage, navigation} = await this.props
    const chatName = await navigation.getParam('chatName', '')
    if (p2chat.newTextMessage != '') {
      await sendMessage(chatName, p2chat.newTextMessage)
      var newMessage = new Object()

      newMessage._id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
      newMessage.text = p2chat.newTextMessage
      newMessage.createdAt = new Date()

      var user = new Object()
      newMessage.user = user
      user._id = this.props.contacts.myProfile.userId
      console.log(newMessage)
      this.addNewMessage(newMessage)
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
  const chatName = await this.props.navigation.getParam('chatName', '')
  await this.setState({refreshing: true});
  await this.props.getP2ChatUpdatedMessageHistory(chatName, this.props.p2chat.end);
  const newMessages = this.props.p2chat.newMessageHistory.messages;
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
        text={this.props.p2chat.newTextMessage}
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
        onPressAvatar={(user) => {
          console.log(user)
          this.props.navigation.navigate('Profile', {
            userName: user.name,
            userId: user.userId,
            userIdName: user.name,
            avatarLink: user.avatar,
            from: 'chat',
          })
        }}
        placeholder={'Type Message Here'}
        renderSend={this.renderSend}
        renderActions={this.renderCustomActions}
        onPressActionButton={this.openActionSheet}
        renderComposer={this.renderComposer}
        renderInputToolbar={this.renderInputToolbar} 
        minInputToolbarHeight={48}
        alwaysShowSend={true}
        user={{
          _id: myUserId,
        }}
        containerStyle={{height:height}}
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
        // top: -5,
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
      p2chat: state.p2chat,
    }
  }

  function mapDispatchToProps (dispatch) {
    return {
        getMyUserId: () => dispatch(getMyUserId()),
        sendMessage: (topic, message) => dispatch(sendMessage(topic, message)),
        handleMessageChange: (text) => dispatch(handleMessageChange(text)),
        getP2ChatMessageHistory: (topic, callback) => dispatch(getP2ChatMessageHistory(topic, callback)),
        getP2ChatUpdatedMessageHistory: (topic, token) => dispatch(getP2ChatUpdatedMessageHistory(topic, token)),
        setNewMessage: (data) => dispatch(setNewMessage(data)),
        pushNewMessage: () => dispatch(pushNewMessage()),
        pushNewMessageSuccess: () => dispatch(pushNewMessageSuccess()),
        pushNewMessageToHistory: () => dispatch(pushNewMessageToHistory()),
        resetNewMessage: () => dispatch(resetNewMessage()),  
    }
  }  
    
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(GroupP2Chat)