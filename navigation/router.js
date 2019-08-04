import React from "react";
import { StyleSheet, Platform, StatusBar } from "react-native";
import { createSwitchNavigator, createBottomTabNavigator,createStackNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../constants'

import SignUp from "../screens/SignUp";
import Login from "../screens/Login";
import ForgotPassword from "../screens/ForgotPassword";
import ResetPassword from "../screens/ResetPassword";

import ContactList from "../screens/ContactList";
import ChatList from "../screens/ChatList";
import Settings from "../screens/Settings";
import MatchesList from "../screens/MatchesList";

const headerStyle = {
  // marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  paddingTop: (Platform.OS === 'android') ? StatusBar.currentHeight : 20,
};

export const SignedOut = createStackNavigator({
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      title: "Sign Up",
      headerStyle
    }
  },
  Login: {
    screen: Login,
    navigationOptions: {
      title: "Login",
      headerStyle
    }
  },
  ResetPassword: {
    screen: ResetPassword,
    navigationOptions: {
      title: "Reset Password",
      headerStyle
    }
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: {
      title: "Forgot Password",
      headerStyle
    }
  },

});

export const SignedIn = createBottomTabNavigator({
  Contacts:{
      screen: createStackNavigator({
          ContactList: {
              screen: ContactList,
              navigationOptions: {
                  headerTitle: 'Contacts',
                  headerStyle,
                  headerTitleStyle: theme.headerTitle,
              }
          },
          MatchesList: {
            screen: MatchesList,
            navigationOptions: {
                headerTitle: 'Matches',
                headerStyle,
                headerTitleStyle: theme.headerTitle,
            }
          }
      }),
      navigationOptions: {
          title: 'Contacts',            
          tabBarIcon: ({ tintColor }) => (
              <Icon name="ios-journal" size={24} color={tintColor} />
          )
      }
  },
  ChatList:{
    screen: createStackNavigator({
        ChatList: {
            screen: ChatList,
            navigationOptions: {
                headerTitle: 'Chatlist',
                headerStyle,
                headerTitleStyle: theme.headerTitle,
            }
        }
    }),
    navigationOptions: {
        title: 'Chatlist',            
        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-chatbubbles" size={24} color={tintColor} />
        )
    }
},
  Settings:{
    screen: createStackNavigator({
        Settings: {
            screen: Settings,
            navigationOptions: {
                headerTitle: 'Settings',
                headerStyle,
                headerTitleStyle: theme.headerTitle,
            }
        }
    }),
    navigationOptions: {
        title: 'Settings',            
        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-settings" size={24} color={tintColor} />
        )
    }
  },
  },
  {
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      style: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }
    }
  }
);

export const createRootNavigator = (signedIn = false) => {
  return createAppContainer(createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      SignedOut: {
        screen: SignedOut
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  ));
};
