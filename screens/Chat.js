import React, { Component } from 'react';
import { KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from "react-native-gifted-chat";
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../constants';

class Chat extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
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
                onPress={() => navigation.navigate('Profile')}
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

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: "I think we passed the first step of the tutorial. We will now need a Pusher account!",
          createdAt: new Date(),
          user: {
            _id: 1,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any"
          }
        }
      ]
    });
  }

  render() {
    return (
        <KeyboardAvoidingView behavior="padding">
            <GiftedChat messages={this.state.messages}/>
        </KeyboardAvoidingView>
    )
  }
}

function mapStateToProps (state) {
    return {
      contacts: state.contacts,
      appState: state.appState,
    }
  }
    
  export default connect(
    mapStateToProps,
  )(Chat)