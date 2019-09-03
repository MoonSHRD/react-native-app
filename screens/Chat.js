import React, { Component } from 'react';
import { Text, KeyboardAvoidingView, StyleSheet } from 'react-native';

import { Block } from '../components';
import { Avatar, Badge } from 'react-native-elements';
import { GiftedChat } from 'react-native-gifted-chat';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../constants';  

class Chat extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: (
                <Block style={styles.userContainer}>
                    <Avatar 
                        containerStyle={styles.avatar}
                        avatarStyle={styles.avatarImage}
                        titleStyle={{fontSize: 12}}
                        title="MD" />
                    <Block style={styles.nameContainer}>
                        <Text style={styles.userNameText}>Name</Text>
                        <Block styles={styles.statusContainer}>
                            <Badge 
                                containerStyle={styles.userBadge}
                                badgeStyle={{height: 8, width: 8}}
                                status="primary"
                                />
                            <Text style={styles.statusText}>Online</Text>
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
                // onPress={() => navigation.navigate('Profile')}
                style={{paddingVertical: 10, paddingHorizontal: 20,}}
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

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
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

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        onSend={messages => this.onSend(messages)}
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
    statusText: {
        fontSize: 9,
        lineHeight: 16,
        letterSpacing: -0.00615385,
        fontWeight: 'normal',
        position: 'absolute',
        top: 13,
        left: 18,
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