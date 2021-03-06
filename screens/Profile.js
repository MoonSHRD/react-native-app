import React, { Component } from 'react';
import { Image, Platform, View, Dimensions, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet, DeviceEventEmitter } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Block, Text, Input } from '../components';
import { theme } from '../constants';
import { Overlay, Avatar, ThemeConsumer } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-action-sheet';
import MatrixClient from  '../native/MatrixClient';

import {connect} from 'react-redux';
import { getContactInfo, deselectContact, getMyUserProfile, saveNewUserName, saveNewAvatar, getMyUserId } from '../store/actions/contactsActions';
import { subcribeToTopic, unsubscribeFromTopic, getCurrentTopics, setVisible, setMatchedUser } from '../store/actions/p2chatActions';

const { width, height } = Dimensions.get('window');

class Profile extends Component {
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
              Profile</Text>
        ),      
      headerRight: (
        <Icon
          name="ios-more" 
          size={24} 
          color={
            navigation.getParam('nightTheme') 
            ?
            theme.colors.white
            :
            theme.colors.blue
          }
          onPress={() => navigation.navigate('Profile')}
          style={
            Platform.OS === 'ios'
            ?
            {paddingVertical: 10, paddingHorizontal: 20}
            :
            {paddingVertical: 10, paddingHorizontal: 20, transform: [{ rotate: '90deg' }]}
            }
        />
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
      userName:'',
      avatarUrl: '',
      name: 'Andrew Shoagase',
      isModalVisible: false,
      avatarChanged: false,
      newName: '',
      phone: '+1(323)564-34-22',
      tags: [],
      newTag: '',
      errors: [],
      suggestedTags: [
        {
            name: 'Crypto',
        },
        {
            name: 'Blockchain',
        },
        {
            name: 'Finance',
        },  
        {
            name: 'Dating',
        },
        {
            name: 'Business',
        },
        {
            name: 'News',
        },
        {
            name: 'Politics',
        },
        {
            name: 'Food',
        },
        {
            name: 'Home cooking',
        },
        {
            name: 'English',
        },
        {
            name: 'Spanish',
        },
        {
            name: 'German',
        },
        {
            name: 'French',
        },
        {
            name: 'Greek',
        },
        {
            name: 'Italian',
        },
        {
            name: 'Portuguese',
        },
        {
            name: 'Danish',
        },
        {
            name: 'Dutch',
        },
        {
            name: 'Chinese',
        },
        {
            name: 'Japanese',
        },
        {
            name: 'Football',
        },
        {
            name: 'Basketball',
        },
        {
            name: 'Golf',
        },
        {
            name: 'Boxing',
        },
        {
            name: 'Arts',
        },
        {
            name: 'Contemporary art',
        },
        {
            name: 'Digital art',
        },
        {
            name: 'Classic art',
        },
        {
            name: 'Music',
        },
        {
            name: 'Illistrations',
        },
        {
            name: 'Techno',
        },
        {
            name: 'Rock',
        },
        {
            name: 'Rap',
        },
        {
            name: 'Hip Hop',
        },
        {
            name: 'Test',
        }
      ]
  }

  constructor(){
    super();
        this.goToChatScreen = this.goToChatScreen.bind(this);
  } 

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  loadProfile = async () => {
    const userId = await this.props.navigation.getParam('userId', 'userId');
    await console.log(userId)
    await this.props.getContactInfo(userId.toLowerCase())
    await this.checkIfInvite()
    await this.checkName()
    await this.props.getMyUserId()
    await this.loadAvatar()
  }

  checkIfInvite = async () => {
      const userName = this.props.navigation.getParam('userName', 'userName')
      const userIdName = this.props.navigation.getParam('userIdName', 'userIdName').toLowerCase()
      const roomId = this.props.navigation.getParam('roomId', 'roomId')
      console.log('Приглашение от ' + userIdName)
      if (userName == 'Приглашение от ' + userIdName || userName == 'Invite from ' + userIdName) { 
            console.log('invite has to be sended')
            const promise = MatrixClient.acceptInvite(roomId)
            promise.then((data) => {
                console.log(data)
            },
            (error) => {
                console.log(error)
            })
      }
  }

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  acceptInvite = async (roomId) => {
      const promise = MatrixClient.acceptInvite(roomId)
      promise.then(async = (data) => {
          const jsonData = JSON.parse(data)
          const user = new Object()
          
          this.props.navigation.navigate('Chat', {
            userName: jsonData.name,
            userIdName: this.parseUserId(jsonData.userId),
            userId: jsonData.userId,
            avatarUrl: jsonData.avatarUrl,
            avatarLink: this.parseAvatarUrl(jsonData.avatarUrl),
            isActive: jsonData.isActive,
            lastSeen: jsonData.lastSeen,
            roomId: jsonData.roomId
        },
        (error) => {
            console.log(error);
        })        
      })
  }

  checkName = async () => {
    const userName = await this.props.navigation.getParam('userName', '');
    const userIdName = await this.props.navigation.getParam('userIdName', '')
    if (userName == '') {
        console.log('using userIdName')
        var result = await this.capitalize(userIdName)
        await this.setState({name: result})
    } else {
        console.log('using userName')
        var result = await this.capitalize(userName)
        await this.setState({name: result})
    }
  }
  
  capitalize(props) {
    let text = props.slice(0,1).toUpperCase() + props.slice(1, props.length);
    return text
  }

  loadAvatar = async () => {
    const avatarLink = await this.props.navigation.getParam('avatarLink', '');
    if (avatarLink != '') {
        await this.setState({avatarUrl: avatarLink})
    } else {
        const newAvatarLink = await this.parseAvatarUrl(this.props.contacts.contact.avatarUrl)
        await this.setState({avatarUrl: newAvatarLink})
    }
  }

  goToChatScreenMatch = async (navigation) => {
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

  parseUserId(props) {
    if (props != '') {
      let parts = props.split('@', 2);
      let userId  = parts[1];
      let userIdParts = userId.split(':', 2)
      let firstPart = userIdParts[0]
      return this.capitalize(firstPart)
    }
  }


  loadMyAvatar = async () => {
    const avatarLink = await this.props.navigation.getParam('myAvatar', '');
    if (avatarLink != '') {
        var result = await this.parseAvatarUrl(avatarLink)
        await this.setState({avatarUrl: result})
    }
  }

  parseAvatarUrl(props) {
    if (props != '') {
        let parts = props.split('mxc://', 2);
        let urlWithoutMxc  = parts[1];
        let urlParts = urlWithoutMxc.split('/', 2)
        let firstPart = urlParts[0]
        let secondPart = urlParts[1] 
        let serverUrl = 'https://matrix.moonshard.tech/_matrix/media/r0/download/'
        return serverUrl + firstPart + '/' + secondPart    
    }
}


  loadMyProfile = async () => {
    await this.props.getMyUserProfile()
    await this.props.getMyUserId()
    await this.loadMyAvatar()
  }

  goToChatScreen = async (navigation) => {
    if (this.props.contacts.contact.roomId != null) {
        roomId = this.props.contacts.contact.roomId
        await this.props.navigation.navigate('Chat', {
            userName: this.capitalize(this.props.contacts.contact.name),
            userIdName: this.parseUserId(this.props.contacts.contact.userId),
            userId: this.props.contacts.contact.userId,
            avatarUrl: this.props.contacts.contact.avatarUrl,
            avatarLink: this.parseAvatarUrl(this.props.contacts.contact.avatarUrl),
            isActive: this.props.contacts.contact.isActive,
            lastSeen: this.props.contacts.contact.lastSeen,
            roomId: roomId
        })        
    } else {
        userId = this.props.contacts.contact.userId
        const promise = MatrixClient.createDirectChat(userId)
        promise.then(async (data) => {
            await console.log(data)
            await this.props.navigation.navigate('Chat', {
                userName: this.capitalize(this.props.contacts.contact.name),
                userIdName: this.parseUserId(this.props.contacts.contact.userId),
                userId: this.props.contacts.contact.userId,
                avatarUrl: this.props.contacts.contact.avatarUrl,
                avatarLink: this.parseAvatarUrl(this.props.contacts.contact.avatarUrl),
                isActive: this.props.contacts.contact.isActive,
                lastSeen: this.props.contacts.contact.lastSeen,
                roomId: data
            })
          },
          (error) => {
            console.log(error);
          }
        )    
    }
  }

  setHeaderParams = () => {
    this.props.navigation.setParams({nightTheme: this.props.appState.nightTheme});  
  }

  changeUserName = (data) => {
    this.setState({newName: data})
  }

  changeAvatar = (data) => {
    this.setState({newAvatar: data})
  }

  saveNewProfile = async () => {
    if (this.state.newAvatar || this.state.newName) {
        if (this.state.newName && this.state.newAvatar) {
            await this.props.saveNewUserName(this.state.newName)
            await this.props.saveNewAvatar(this.state.newAvatarBase64)
            await this.props.navigation.goBack()
        }

        if (this.state.newName) {
            await this.props.saveNewUserName(this.state.newName)
            await this.props.navigation.goBack()
        } 

        if (this.state.newAvatar) {
            await this.props.saveNewAvatar(this.state.newAvatarBase64)
            await this.props.navigation.goBack()
        }
        
    } else {
        await this.props.navigation.goBack()
    }
  }

  openGalleryPicker() {
    ImagePicker.openPicker({
        includeBase64:  true,
      }).then(image => {
        this.setState({newAvatar: `data:${image.mime};base64,${image.data}`})
        this.setState({newAvatarBase64: image.data})
        console.log(image.data)
        this.setState({avatarChanged: true})
        console.log(image);
      });
  }

  openCamera() {
    ImagePicker.openCamera({
        includeBase64:  true,
      }).then(image => {
          this.setState({newAvatar: `data:${image.mime};base64,${image.data}`})
          this.setState({newAvatarBase64: image.data})
          console.log(image.data)
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

  componentDidMount() {
    const {setMatchedUser} = this.props
    this.setState({roomId: this.props.navigation.getParam('roomId', '')})
    this.setHeaderParams()
    this.loadAllTags()
    this.willFocus = this.props.navigation.addListener('willFocus', async () => {
        const userName = await this.props.navigation.getParam('userName', 'userName')
        await (userName != 'userName')
        ?
        this.loadProfile()
        :
        this.loadMyProfile()
    })
    
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


filterItems(array, search) {
    return array.filter(function(array) {
        return array.name.toString().toLowerCase().indexOf(search.toString().toLowerCase()) !== -1;
    })
}

loadAllTags = () => {
    this.props.getCurrentTopics()

    if  (this.props.p2chat.topics.length != 0) {
        allTags = new Array()
        this.props.p2chat.topics.map((data, i) => {
            tag = new Object()
            tag.name = data.valueOf(i)
            allTags = this.state.tags.push(tag)
        })
    }
}


subscribeOnThis = async (topic, index) => {
    await console.log('pressed topic ' +  topic + ' ' + index) 
    const promise = await this.props.subcribeToTopic(topic)
    newTag = new Object()
    newTag.name = topic
    this.setState({
        tags: this.state.tags.concat(newTag)
    })    
    await promise.then((data) => {
        console.log(data)
    },
    (error) => {
        console.log(error)
    })
}

unsubscribeFromThis = async (topic) => {
    await console.log('pressed topic' +  topic)
    const promise = this.props.unsubscribeFromTopic(topic)
    this.setState({
        tags: this.state.tags.filter(tag => tag.name !== topic)
    })        
    await promise.then((data) => {
        console.log(data)
    },
    (error) => {
        console.log(error)
    })
}


  render() {
    const { navigation } = this.props;
    const { loading, errors, newTag, suggestedTags } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 100;
    const userName = this.props.navigation.getParam('userName', '')
    const userIdName = this.props.navigation.getParam('userIdName', '')
    const userId = this.props.navigation.getParam('userId', 'userId')
    const previousScreen = this.props.navigation.getParam('previousScreen', 'previousScreen')

      
    return (
      <KeyboardAvoidingView behavior="padding" >
        <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={scrollEnabled}
            onContentSizeChange={this.onContentSizeChange}
            style={this.props.appState.nightTheme ? styles.darkBackground : styles.background}
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
                        onPress={() => this.goToChatScreenMatch()}
                    >
                      <Text headline bold white center>Send message</Text>
                    </Button>       
                  </Block>
                  </View>
              </Overlay>
            :
            null
          }            
        <View style={{marginBottom: 110,}}>
        {
            (userIdName != '')
            ?
            <Block style={this.props.appState.nightTheme ? styles.darkContainer : styles.container}>
            <Image 
                source={require('../assets/images/backgroundImage.png')} 
                style={styles.backgroundImage}
            />
            <Block style={styles.avatarContainer}>
            {
                this.props.navigation.getParam('from', '') != 'search'
                ?
                <Block>
                    {
                        this.props.contacts.contact.avatarUrl != ''
                        ?
                        <Avatar 
                            rounded
                            source={{
                                uri: this.state.avatarUrl
                            }}
                            containerStyle={this.props.appState.nightTheme ? styles.darkAvatar: styles.avatar}
                            avatarStyle={styles.avatarImage}
                        />
                        :
                        <Avatar 
                            rounded
                            title={
                                this.props.contacts.contact.name != ''
                                ?
                                this.capitalize(this.props.contacts.contact.name[0])
                                :
                                this.state.name[0]
                            }
                            containerStyle={this.props.appState.nightTheme ? styles.darkAvatar: styles.avatar}
                            avatarStyle={styles.avatarImage}
                        />
                    } 
                </Block>   
                :
                <Block>
                {
                    this.props.contacts.contact.avatarUrl != ''
                    ?
                    <Avatar 
                        rounded
                        source={{
                            uri: this.props.navigation.getParam('avatarLink', '')
                        }}
                        containerStyle={this.props.appState.nightTheme ? styles.darkAvatar: styles.avatar}
                        avatarStyle={styles.avatarImage}
                    />
                    :
                    <Avatar 
                        rounded
                        title={this.capitalize(this.props.contacts.contact.name[0])}
                        containerStyle={this.props.appState.nightTheme ? styles.darkAvatar: styles.avatar}
                        avatarStyle={styles.avatarImage}
                    />
                }
                </Block>
            }
            </Block>
            <Block style={styles.profileContainer}>
                <Input
                    editable={false}
                    label="Name"
                    labelStyle={[styles.labels, hasErrors('name')]}
                    error={hasErrors('name')}
                    style={this.props.appState.nightTheme ? [styles.darkInput, hasErrors('name')] : [styles.input, hasErrors('name')]}
                    defaultValue={
                        this.props.contacts.contact.name != ''
                        ?
                        this.props.contacts.contact.name
                        :
                        this.state.name 
                    }
                />
                {
                    this.props.contacts.contact.phone
                    ?
                    <Input
                        editable={false}
                        label="Phone Nymber"
                        labelStyle={[styles.labels, hasErrors('name')]}
                        error={hasErrors('phone')}
                        style={this.props.appState.nightTheme ? [styles.darkInput, hasErrors('phone')] : [styles.input, hasErrors('phone')]}
                        defaultValue={this.props.contacts.contact.phone}
                    />
                    :
                    null
                }
                {
                    this.props.contacts.contact.email
                    ?
                    <Input
                        email
                        editable={false}
                        label="Email"
                        labelStyle={[styles.labels, hasErrors('email')]}
                        error={hasErrors('email')}
                        style={this.props.appState.nightTheme ? [styles.darkInput, hasErrors('email')] : [styles.input, hasErrors('email')]}
                        defaultValue={this.props.contacts.contact.email}
                    />
                    :
                    null
                }
                {
                    (this.props.contacts.contact.tags) 
                    ?
                    <Block>
                        <Text subhead gray style={{marginTop:20}}>Tags</Text>
                        <Block style={styles.tagContainer}>
                        {
                            this.props.contacts.contact.tags.map((l,i) => (
                                    l.matched
                                    ?
                                    <Button
                                        key={i}
                                        style={styles.matchedTag}>
                                        <Text caption white center>{l.name}</Text>
                                    </Button>
                                    :
                                    <Button
                                        key={i}
                                        style={styles.dismatchedTag}>
                                        <Text caption blue center>{l.name}</Text>
                                    </Button>
                            ))
                        }
                        </Block>  
                    </Block>  
                    :
                    null
                }
                <Button gradient style={styles.confirmButton}               
                    onPress={
                        previousScreen == 'Chat'
                        ?
                        () => navigation.goBack()
                        :
                        () => this.goToChatScreen()
                    }
                >
                    <Text headline bold white center>Send Message</Text>
                </Button>       
            </Block>
            </Block>
            :
            <Block style={styles.container}>
            <Image 
                source={require('../assets/images/backgroundImage.png')} 
                style={styles.backgroundImage}
            />
            <Block style={styles.avatarContainer}>
            {
                this.state.avatarChanged
                ?
                <Block>
                {
                    this.state.newAvatar != ''
                    ?
                    <Avatar 
                        rounded
                        source={{uri: this.state.newAvatar}}
                        containerStyle={this.props.appState.nightTheme ? styles.darkAvatar: styles.avatar}
                        avatarStyle={styles.avatarImage}
                        onPress={() => {
                            this.openActionSheet()
                        }}
                    />
                    :
                    <Avatar 
                        rounded
                        title={
                            this.props.contacts.myProfile.name != ''
                            ?
                            this.capitalize(this.props.contacts.myProfile.name[0])
                            :
                            this.capitalize(this.props.contacts.myUserName[0])
                        }
                        containerStyle={this.props.appState.nightTheme ? styles.darkAvatar: styles.avatar}
                        avatarStyle={styles.avatarImage}
                        onPress={() => {
                            this.openActionSheet()
                        }}
                    />
                } 
                </Block>   
                :
                <Block>
                {
                    this.props.contacts.myProfile.avatarUrl != ''
                    ?
                    <Avatar 
                        rounded
                        source={{uri: this.props.contacts.myProfile.avatarLink}}
                        containerStyle={this.props.appState.nightTheme ? styles.darkAvatar: styles.avatar}
                        avatarStyle={styles.avatarImage}
                        onPress={() => {
                            this.openActionSheet()
                        }}
                    />
                    :
                    <Avatar 
                        rounded
                        title={
                            this.props.contacts.myProfile.name != ''
                            ?
                            this.capitalize(this.props.contacts.myProfile.name[0])
                            :
                            this.capitalize(this.props.contacts.myUserName[0])
                        }
                        containerStyle={this.props.appState.nightTheme ? styles.darkAvatar: styles.avatar}
                        avatarStyle={styles.avatarImage}
                        onPress={() => {
                            this.openActionSheet()
                        }}
                    />
                }
                </Block>    
            }
            </Block>
            <Block style={styles.profileContainer}>
                <Input
                    label="Name"
                    labelStyle={[styles.labels, hasErrors('name')]}
                    error={hasErrors('name')}
                    style={this.props.appState.nightTheme ? [styles.darkInput, hasErrors('name')] : [styles.input, hasErrors('name')]}
                    defaultValue={
                        this.props.contacts.myProfile.name != ''
                        ?
                        this.props.contacts.myProfile.name
                        :
                        this.capitalize(this.props.contacts.myUserName)
                    }
                    onChangeText={text => this.changeUserName(text)}
                />
                {
                    this.props.contacts.myProfile.phone
                    ?
                    <Input
                        label="Phone Nymber"
                        labelStyle={[styles.labels, hasErrors('name')]}
                        error={hasErrors('phone')}
                        style={this.props.appState.nightTheme ? [styles.darkInput, hasErrors('phone')] : [styles.input, hasErrors('phone')]}
                        defaultValue={this.props.contacts.myProfile.phone}
                        onChangeText={text => this.setState({ phone: text })}
                    />
                    :
                    null
                }
                {
                    this.state.tags.length === 0
                    ?
                    null
                    :
                    <Block>
                        <Text subhead gray style={{marginTop:20}}>My Tags</Text>
                        <Block style={styles.tagContainer}>
                        {
                            this.state.tags.map((l,i) => (
                                    <Button
                                        key={i}
                                        style={styles.matchedTag}
                                        onPress={() => this.unsubscribeFromThis(l.name)}>
                                        <Text caption white center>{l.name}</Text>
                                    </Button>
                            ))
                        }
                        </Block>
                    </Block>    
                }
                <Input
                    error={hasErrors('tags')}
                    style={this.props.appState.nightTheme ? [styles.darkInput, hasErrors('tags')] : [styles.input, hasErrors('tags')]}
                    placeholder={'Enter New Tag'}
                    placeholderTextColor={theme.colors.gray}
                    defaultValue={newTag}
                    onChangeText={text => this.setState({ newTag: text })}
                />
                {
                    newTag !== '' 
                    ?
                    <Block style={this.props.appState.nightTheme ? styles.darkNewTagContainer : styles.newTagContainer}>
                        <Text caption2 gray style={styles.suggestedTagsText}>Suggested tags</Text>
                        <Block style={styles.newTagList}>
                            {
                                this.filterItems(suggestedTags, newTag).map((l,i) => (
                                    // l.matched
                                    // ?
                                    // <Button
                                    //     key={i}
                                    //     style={this.props.appState.nightTheme ? styles.darkMatchedTag : styles.matchedTag}
                                    //     onPress={this.subscribeOnThis(l.name)}>
                                    //     <Text caption style={this.props.appState.nightTheme ? {color: theme.colors.black}: {color: theme.colors.white}} center>{l.name}</Text>
                                    // </Button>
                                    // :
                                    <View>
                                    <Button
                                        key={i}
                                        style={this.props.appState.nightTheme ? styles.darkDismatchedTag : styles.dismatchedTag}
                                        onPress={() => {this.subscribeOnThis(l.name, i)}}>
                                            <Text caption style={this.props.appState.nightTheme ? {color: theme.colors.white}: {color: theme.colors.blue}} center>{l.name}</Text>
                                    </Button>
                                    </View>
                                ))
                            }
                        </Block>
                    </Block>
                    :
                    null
                }
                <Button gradient style={styles.confirmButton}               
                    onPress={() => this.saveNewProfile()}
                >
                    <Text headline bold white center>Save</Text>
                </Button>       
            </Block>
        </Block>
        }
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: theme.colors.white,
        height: height,
    },
    darkBackground: {
        backgroundColor: theme.colors.black,
        height: height,
    },    
    headerText: {
        marginLeft: "auto", 
        marginRight: "auto",
        fontSize: 14, 
        fontWeight: '600', 
        letterSpacing: -0.0241176,
        color: theme.colors.notBlack,
    },
    darkHeaderText: {
        marginLeft: "auto", 
        marginRight: "auto",
        fontSize: 14, 
        fontWeight: '600', 
        letterSpacing: -0.0241176,
        color: theme.colors.white,
    },    
    container: {
        flex: 1,
        padding: 0,
        margin: 0,
        marginBottom: 15,
    },
    darkContainer: {
        flex: 1,
        padding: 0,
        margin: 0,
        marginBottom: 15,
        backgroundColor: theme.colors.black,
    },
    backgroundImage: {
        width: width,
        height: 96,
        margin: 0,
        padding: 0
    },
    avatarContainer: {
        position: 'absolute', 
        top: 35,
        width: width,
        alignItems: 'center'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        borderColor: theme.colors.white,
        borderStyle: 'solid',
        borderWidth: 3,
    },
    darkAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        borderColor: theme.colors.black,
        borderStyle: 'solid',
        borderWidth: 3,
    },
    profileContainer: {
        width: width - 72,
        marginHorizontal: 32,
        marginTop: 24,
    },
    input: {
        borderWidth: 0,
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        fontSize: theme.sizes.body,
        marginTop: 8,
        fontWeight: 'normal',
        padding: 12,
        color: theme.colors.notBlack,
    }, 
    darkInput: {
        borderWidth: 0,
        backgroundColor: theme.colors.notBlack,
        borderRadius: 8,
        fontSize: theme.sizes.body,
        fontWeight: 'normal',
        marginTop: 8,
        padding: 12,
        color: theme.colors.white,
    },
    labels: {
        fontSize: theme.sizes.subhead,
        color: theme.colors.gray,
        letterSpacing: -0.016,
        lineHeight: 20,
        marginTop: 15,
    },
    tagContainer: {
        flexDirection: "row",
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginTop: 8,
    },  
    matchedTag: {
        backgroundColor: theme.colors.blue,
        borderRadius: 16,
        overflow: 'hidden',
        height: 24,
        paddingVertical: 4,
        paddingHorizontal: 16,
        marginHorizontal: 2,
    },
    darkMatchedTag: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        height: 24,
        paddingVertical: 4,
        paddingHorizontal: 16,
        marginHorizontal: 2,
    },
    dismatchedTag: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        height: 24,
        paddingVertical: 4,
        paddingHorizontal: 16,
        marginHorizontal: 2,
        borderWidth: 1,
        borderColor: theme.colors.blue,
    },
    darkDismatchedTag: {
        backgroundColor: theme.colors.notBlack,
        borderRadius: 16,
        overflow: 'hidden',
        height: 24,
        paddingVertical: 4,
        paddingHorizontal: 16,
        marginHorizontal: 2,
        borderWidth: 1,
        borderColor: theme.colors.white,
    },
    newTagContainer: {
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 8,
        marginTop: 20,
        borderColor: 8,
    },
    darkNewTagContainer: {
        backgroundColor: theme.colors.notBlack,
        paddingHorizontal: 8,
        marginTop: 20,
        borderColor: 8,
    },
    suggestedTagsText: {
        paddingTop: 8,
    },
    newTagList: {
        flexDirection: "row",
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        paddingTop: 11,
    },
    confirmButton: {
        marginTop: 20,
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
      contacts: state.contacts,
      appState: state.appState,
      p2chat: state.p2chat,
    }
  }
  
  function mapDispatchToProps (dispatch) {
    return {
      getContactInfo: (data) => dispatch(getContactInfo(data)),
      deselectContact: () => dispatch(deselectContact()),
      getMyUserId: () => dispatch(getMyUserId()),
      getMyUserProfile: () => dispatch(getMyUserProfile()),
      createDirectChat: (data) => dispatch(createDirectChat(data)),
      saveNewUserName: (data) => dispatch(saveNewUserName(data)),
      saveNewAvatar: (data) => dispatch(saveNewAvatar(data)),
      subcribeToTopic:  (data) =>  dispatch(subcribeToTopic(data)),
      unsubscribeFromTopic:  (data) =>  dispatch(unsubscribeFromTopic(data)), 
      getCurrentTopics: () => dispatch(getCurrentTopics()), 
      setMatchedUser: (data) => dispatch(setMatchedUser(data)),
      setVisible: (data) => dispatch(setVisible(data)),  
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Profile)