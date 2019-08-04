import React, { Component } from 'react';
import { Platform, View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Block, Input, Text } from '../components';
import { SearchBar, ListItem } from 'react-native-elements';
import { theme } from '../constants';

const { width, height } = Dimensions.get('window');

export default class ContactList extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Icon
          name="ios-person" 
          size={24} 
          color={theme.colors.blue}
          onPress={() => navigation.navigate('MatchesList')}
          style={{paddingVertical: 10, paddingHorizontal: 20,}}
        />
      ),
    };
  }

  state = {
    search: '',
    screenHeight: height,
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  updateSearch = search => {
    this.setState({ search });
  };
  
  render() {
    const { navigation } = this.props;
    const { loading, errors, search } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height;

    const list = [
      {
        name: 'Amy Farha',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        subtitle: 'Online'
      },
      {
        name: 'Chris Jackson',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Last seen June 12th 22:30'
      },
      {
        name: 'Secret Friend',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Online'
      },
      {
        name: 'Windrunner',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Last seen June 12th 22:30'
      },
      {
        name: 'Secret Friend',
        avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        subtitle: 'Online'
      },

    ] 

    return (
      <KeyboardAvoidingView style={styles.signup} behavior="padding">
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
          <ListItem 
            key="newcontact"
            title="Add contact"
            titleStyle={styles.title}
            leftIcon={{name:'person-add'}}
          />
          <ListItem 
            key="findmatches"
            title="Find matches on this place"
            titleStyle={styles.title}
            leftIcon={{name:'near-me'}}
          />
          {
            list.map((l, i) => (
              <ListItem
                key={i}
                leftAvatar={{ source: { uri: l.avatar_url } }}
                title={l.name}
                titleStyle={styles.title}
                subtitle={l.subtitle}
                subtitleStyle={styles.subtitle}
                style={styles.list}
              />
            ))
          }
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  list: {
    borderRadius: 16,
    shadowColor: '#b2bcf3',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,  
    elevation: 5
  },  
  title: {
    color: theme.colors.notBlack,
    fontSize: theme.sizes.headline,
    fontWeight: "600",
    letterSpacing: -0.0241176,
  },
  subtitle: {
    color: theme.colors.gray,
    fontSize: theme.sizes.caption2,
    marginTop: 2,
  }
})
