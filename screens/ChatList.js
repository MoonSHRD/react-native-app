import React, { Component } from 'react';
import { Platform, View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Badge, SearchBar, ListItem } from 'react-native-elements';
import { theme } from '../constants';
import { Text } from '../components';


const { width, height } = Dimensions.get('window');

export default class ChatList extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text notBlack style={{fontSize: 14, fontWeight: '600', letterSpacing: -0.0241176}}>Chatlist</Text>
      ),
      headerLeft: (
        <Icon
          name="ios-create" 
          size={24} 
          color={theme.colors.blue}
          onPress={() => navigation.navigate('NewChat')}
          style={{paddingVertical: 10, paddingHorizontal: 20,}}
        />
      ),
      headerRight: (
        <Icon
          name="ios-person" 
          size={24} 
          color={theme.colors.blue}
          onPress={() => navigation.navigate('Profile')}
          style={{paddingVertical: 10, paddingHorizontal: 20,}}
        />
      ),  
    }
  };
  state = {
    search: '',
    screenHeight: height,
    chatList: [
      {
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        lastMessage: 'Online',
        date: 'Sat',
        unreadMessages: 3,
        isOnline: true,
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        lastMessage: 'Last seen June 12th 22:30',
        date: '04:30',
        isOnline: false,
      },
      {
        name: 'Secret Friend',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        lastMessage: 'Online',
        unreadMessages: 99,
        isOnline: false,
      },
      {
        name: 'Windrunner',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        lastMessage: 'Last seen June 12th 22:30',
        date: '01.09',
        isOnline: false,
      },
      {
        name: 'Secret Friend',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        lastMessage: 'Online',
        date: '04:22',
        unreadMessages: 3,
        isOnline: false,
      },
      {
        name: 'Secret Friend',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        lastMessage: 'Online',
        date: '17:46',
        isOnline: false,
      },
      {
        name: 'Windrunner',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        lastMessage: 'Welcome to the club, buddy',
        date: 'Sun',
        isOnline: true,
      },
      {
        name: 'Secret Friend',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        lastMessage: 'Online',
        date: 'Tue',
        isOnline: false,
      },
      {
        name: 'Secret Friend',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        lastMessage: 'Online',
        date: 'Sat',
        isOnline: false,
      },
      {
        name: 'Windrunner',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        lastMessage: 'Last seen June 12th 22:30',
        date: '01.12',
        isOnline: true,
      },
      {
        name: 'Secret Friend',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        lastMessage: 'Online',
        date: '08:31',
        unreadMessages: 1,
        isOnline: false,
      },
    ]
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  updateSearch = search => {
    this.setState({ search });
  };
  
  render() {
    const { navigation } = this.props;
    const { loading, errors, search, chatList } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 100;

    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
        >
        { Platform.OS === 'ios'
          ? 
          <SearchBar 
            placeholder="Search"
            platform="ios"
            onChangeText={this.updateSearch}
            value={search}
            containerStyle={styles.searchBar}
            inputContainerStyle={styles.searchInputBar}
            inputStyle={styles.searchInputText}
          />
          :
          <SearchBar 
            placeholder="Search"
            platform="android"
            onChangeText={this.updateSearch}
            value={search}
          />
        }
        <View>
          {
            chatList.map((l, i) => (
              <View style={styles.viewList}>
                <ListItem
                  key={i}
                  leftAvatar={{ source: { uri: l.avatar_url }, containerStyle: { width: 48, height: 48, borderRadius: 50, overflow: 'hidden' } }}
                  title={l.name}
                  titleStyle={styles.title}
                  rightTitle={l.date}
                  rightTitleStyle={styles.dateTag}
                  subtitle={l.lastMessage}
                  subtitleStyle={styles.subtitle}
                  containerStyle={styles.list}
                />
                  {
                    l.unreadMessages > 0 
                    ?
                    <Badge 
                      value={l.unreadMessages} 
                      status="error" 
                      badgeStyle={{ width: 24, height: 24, borderRadius: 50, overflow: 'hidden'}}
                      containerStyle={{ position: 'absolute', top: 36, right: 16}}
                      textStyle={{fontSize: 12}}
                    />
                    :
                    null
                  }
                  {
                    (l.isOnline) 
                    ? 
                    <Badge 
                      status="primary" 
                      badgeStyle={{width: 12, height: 12, overflow: 'hidden', borderRadius: 50, backgroundColor: theme.colors.blue}}
                      containerStyle={{ position: 'absolute', top: 48, left: 52}}
                    />
                    :
                    null
                  }
                </View>
            ))
          }
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 0
  },
  searchInputBar: {
    backgroundColor: '#FAFAFA',
    margin: 0,
    borderWidth: 0,
    borderRadius: 16,
  },
  searchInputText: {
    fontSize: theme.sizes.caption,
    color: theme.colors.gray
  },
  viewList: {
    width: width - 16,
    marginHorizontal: 8,
    shadowColor: '#b2bcf3',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,  
    elevation: 5,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
  },  
  title: {
    color: theme.colors.notBlack,
    fontSize: theme.sizes.headline,
    fontWeight: "600",
    letterSpacing: -0.0241176,
    lineHeight: 24,
  },
  subtitle: {
    color: theme.colors.gray,
    fontSize: theme.sizes.subhead,
    marginTop: 4,
    lineHeight: 20,
    width: 256,
    overflow: 'hidden'
  },
  dateTag: {
    fontSize: theme.sizes.footnote,
    color: theme.colors.gray,
    position: 'absolute',
    top: -22,
    right: 0
  }
})
