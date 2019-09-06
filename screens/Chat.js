import React, { Component } from 'react';
import { Text, KeyboardAvoidingView, StyleSheet, Platform, View } from 'react-native';

import { Block } from '../components';
import { Avatar, Badge } from 'react-native-elements';
import { GiftedChat, Actions, SystemMessage, Send } from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import TimeAgo from 'react-native-timeago';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../constants';  

class Chat extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const userName = navigation.getParam('userName', 'userName')
        const userId = navigation.getParam('userId', 'userId')
        const isActive = navigation.getParam('isActive')
        const lastSeen = navigation.getParam('lastSeen')
        const avatar = navigation.getParam('avatar')
        return {
            headerTitle: (
                <Block style={styles.userContainer}>
                    {
                        avatar != ''
                        ? 
                        <Avatar 
                            source={avatar}
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
                        <Text style={styles.userNameText}>{userName}</Text>
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
                    onPress={() => {
                        navigation.navigate('Profile', {
                            userName: userName,
                            userId: userId,
                        })
                    }}  
                    style={
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
        {
          _id: 1,
          text: 'Test Message in personal chat',
          createdAt: new Date(),
        },
        {
          _id: 2,
          text: 'Test Message in group chat',
          createdAt: new Date(),
          user: {
            _id: 3,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderSend(props) {
    return (
        <Send
            {...props}
        >
                <Icon
                    name="ios-arrow-dropup-circle" 
                    size={32} 
                    color={theme.colors.blue}
                    style={{marginRight: 10, marginBottom: 5}}
                />
        </Send>
    );
}

renderActions() {
    return (
        <Icon
            name="ios-attach" 
            size={24} 
            color={theme.colors.blue}
            style={{marginLeft: 16, marginTop: 12, transform: [{ rotate: '45deg' }]}}
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