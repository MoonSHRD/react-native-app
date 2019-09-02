import React from "react";
import { StyleSheet, Platform, StatusBar } from "react-native";
import { createSwitchNavigator, createBottomTabNavigator,createStackNavigator, createAppContainer } from "react-navigation";
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../constants'

import SignUp from "../screens/SignUp";
import Login from "../screens/Login";
import ForgotPassword from "../screens/ForgotPassword";
import ResetPassword from "../screens/ResetPassword";
import EmailConfirm from '../screens/EmailConfirm';

import ContactList from "../screens/ContactList";
import ChatList from "../screens/ChatList";
import Chat from "../screens/Chat";
import Settings from "../screens/Settings";
import MatchesList from "../screens/MatchesList";
import NewChat from "../screens/NewChat";
import NewGroupChat from "../screens/NewGroupChat";
import Profile from "../screens/Profile";
import ChatBackground from "../screens/ChatBackground";

const headerStyle = {
  // marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  // paddingTop: (Platform.OS === 'android') ? StatusBar.currentHeight : 20,
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
  EmailConfirm: {
    screen: EmailConfirm,
    navigationOptions: {
      title: "Confirm Email",
      headerStyle
    }
  },

});

// const ContactsNavigator = createStackNavigator({
//   ContactList: ContactList,
//   MatchesList: MatchesList,
//   Profile: Profile,
// });

// const ChatListNavigator = createStackNavigator({
//   ChatList: ChatList,
//   NewChat: NewChat,
//   NewGroupChat: NewGroupChat,
//   Profile: Profile,
// });

// const SettingsNavigator = createStackNavigator({
//   Settings: Settings,
//   Profile: Profile,
//   ChatBackground: ChatBackground,
// });

// const TabNavigator = createBottomTabNavigator({
//   Contacts: ContactsNavigator,
//   ChatList: ChatListNavigator,
//   Settings: SettingsNavigator,
// });

// TabNavigator.navigationOptions = (navigation) => {
//   return {
//       tabBarOptions: {
//       showLabel: false,
//       showIcon: true,
//       style: {
//         // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
//       }
//     }
//   }
// }

export const TabNavigator = createBottomTabNavigator({
  Contacts:{
      screen: createStackNavigator({
          ContactList: {
              screen: ContactList,
              navigationOptions: {
                  headerTitleStyle: theme.headerTitle,
              }
          },
          MatchesList: {
            screen: MatchesList,
            navigationOptions: {
                headerTitleStyle: theme.headerTitle,
            }
          },
          Profile: {
            screen: Profile,
            navigationOptions: {
                headerTitleStyle: theme.headerTitle,
            }
          }
      }, { headerLayoutPreset: 'center' }),
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
                headerTitleStyle: theme.headerTitle,
            }
        },
        NewChat: {
          screen: NewChat,
          navigationOptions: {
              headerTitleStyle: theme.headerTitle,
          }
        },
        NewGroupChat: {
          screen: NewGroupChat,
          navigationOptions: {
              headerTitleStyle: theme.headerTitle,
          }
        },
        Profile: {
          screen: Profile,
          navigationOptions: {
              headerTitleStyle: theme.headerTitle,
          }
        }
    }, { headerLayoutPreset: 'center' }),
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
                headerTitleStyle: theme.headerTitle,
            }
        },
        Profile: {
          screen: Profile,
          navigationOptions: {
              headerTitleStyle: theme.headerTitle,
          }
        },
        ChatBackground: {
          screen: ChatBackground,
          navigationOptions: {
            headerTitleStyle: theme.headerTitle,
          }
        }
    }, { headerLayoutPreset: 'center' }),
    navigationOptions: {
        header: () => null,
        title: 'Settings',            
        tabBarIcon: ({ tintColor }) => (
            <Icon name="ios-settings" size={24} color={tintColor} />
        ),
    }
  },
  },
  {
    tabBarOptions: {
      showLabel: false,
      showIcon: true,
      style: {
        // paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
      }
    }
  }
);

const SignedIn = createStackNavigator({
  Tabs: TabNavigator,
  Chat: Chat,
}, 
{
  // headerMode: 'none',
  navigationOptions: {
      headerVisible: false,
  }
});


export const createRootNavigator = (signedIn = false) => {
  return createAppContainer(createSwitchNavigator(
    {
      SignedIn: {
        screen: SignedIn
      },
      SignedOut: {
        screen: SignedOut
      },
      Chat: {
        screen: Chat
      }
    },
    {
      initialRouteName: signedIn ? "SignedIn" : "SignedOut"
    }
  ));
};
