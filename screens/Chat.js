import React, { Component } from 'react';
import { Text, KeyboardAvoidingView, Dimensions, StyleSheet, Platform, View } from 'react-native';

import { Block, Input } from '../components';
import { Avatar, Badge, Icon } from 'react-native-elements';
import { GiftedChat, Actions, SystemMessage, Send, InputToolbar, Composer } from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import TimeAgo from 'react-native-timeago';
import { theme } from '../constants';  
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';

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
                          title={userIdName[0]}
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
            headerLeft: (
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
                        navigation.navigate('Profile', {
                            userName: userName,
                            userIdName: userIdName,
                            userId: userId,
                            avatarLink: avatarLink,
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

  componentDidMount = () => {
      console.log(this.props.navigation.getParam('userName', 'userName'))
  }

  capitalize(props) {
    let text = props.slice(0,1).toUpperCase() + props.slice(1, props.length);
    return text
  }


  componentWillMount() {
    this.setState({
      messages: [
        // {
        //   _id: 1,
        //   text: 'Test Message in personal chat',
        //   createdAt: new Date(),
        // },
        // {
        //   _id: 2,
        //   text: 'Test Message in group chat',
        //   createdAt: new Date(),
        //   user: {
        //     _id: 3,
        //     name: 'React Native',
        //     avatar: 'https://placeimg.com/140/140/any',
        //   },
        // },
        {
          _id: 1,
          text: 'This is a quick reply. Do you love Gifted Chat? (radio) KEEP IT',
          createdAt: new Date(),
          quickReplies: {
            type: 'radio', // or 'checkbox',
            keepIt: true,
            values: [
              {
                title: '😋 Yes',
                value: 'yes',
              },
              {
                title: '📷 Yes, let me show you with a picture!',
                value: 'yes_picture',
              },
              {
                title: '😞 Nope. What?',
                value: 'no',
              },
            ],
          },
          user: {
            _id: 2,
            name: 'React Native',
          },
        },
        {
          _id: 2,
          text: 'This is a quick reply. Do you love Gifted Chat? (checkbox)',
          createdAt: new Date(),
          quickReplies: {
            type: 'checkbox', // or 'radio',
            values: [
              {
                title: 'Yes',
                value: 'yes',
              },
              {
                title: 'Yes, let me show you with a picture!',
                value: 'yes_picture',
              },
              {
                title: 'Nope. What?',
                value: 'no',
              },
            ],
          },
          user: {
            _id: 2,
            name: 'React Native',
          },
        }      
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  openGalleryPicker() {
    ImagePicker.openPicker({
        width: 100,
        height: 100,
        cropping: true,
        includeBase64:  true,
      }).then(image => {
        this.setState({newAvatar: `data:${image.mime};base64,${image.data}`})
        this.setState({avatarChanged: true})
        console.log(image);
      });
  }

  openCamera() {
    ImagePicker.openCamera({
        width: 100,
        height: 100,
        cropping: true,
        includeBase64:  true,
      }).then(image => {
          this.setState({newAvatar: `data:${image.mime};base64,${image.data}`})
          this.setState({avatarChanged: true})
          console.log(image);
      });      
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
              this.openGalleryPicker()
          } 
          if (buttonIndex == 1) {
              this.openCamera()
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

renderActions() {
    return (
        <Icon
            name="ios-attach" 
            type="ionicon"
            size={28} 
            color={theme.colors.blue}
            containerStyle={{marginLeft: 22, marginBottom: 16, transform: [{ rotate: '45deg' }]}}
            onPress={() => this.openActionSheet()}
        />
    );
}

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
        placeholder={'Type Message Here'}
        renderSend={this.renderSend}
        renderActions={this.renderActions}
        renderComposer={this.renderComposer}
        renderInputToolbar={this.renderInputToolbar} 
        minInputToolbarHeight='48'
        alwaysShowSend={true}
        user={{
          _id: 1,
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
    }
})

function mapStateToProps (state) {
    return {
      contacts: state.contacts,
      appState: state.appState,
    }
  }
    
  export default connect(
    mapStateToProps,
  )(Chat)