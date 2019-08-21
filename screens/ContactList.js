import React, { Component } from 'react';
import { Platform, View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import {BoxShadow} from 'react-native-shadow';
import Icon from 'react-native-vector-icons/Ionicons';
import { SearchBar, ListItem, ThemeConsumer } from 'react-native-elements';
import { theme } from '../constants';
import { Text } from '../components'

const { width, height } = Dimensions.get('window');

export default class ContactList extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text notBlack style={{fontSize: 14, fontWeight: '600', letterSpacing: -0.0241176}}>Contacts</Text>
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
    };
  }

  state = {
    search: '',
    screenHeight: height,
    contactList: [
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
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  updateSearch = search => {
    this.setState({ search });
  };
  
  render() {
    const { navigation } = this.props;
    const { loading, errors, search, contactList } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 100;
    const shadowOpt = {
			color:"#b2bcf3",
			radius:7,
      opacity:0.2,
			x:0,
			y:-2,
		}

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
            onChangeText={this.updateSearch}
            platform="ios"
            value={search}
            containerStyle={styles.searchBar}
            inputContainerStyle={styles.searchInputBar}
            inputStyle={styles.searchInputText}
          />
          :
          <SearchBar 
            placeholder="Search"
            platform="ios"
            onChangeText={this.updateSearch}
            cancelButtonTitle={null}
            value={search}
            containerStyle={styles.searchBar}
            inputContainerStyle={styles.searchInputBar}
            inputStyle={styles.searchInputText}
          />
        }
        <View>
          <ListItem 
            key="newcontact"
            title="Add contact"
            titleStyle={styles.title}
            leftIcon={{name:'person-add'}}
            containerStyle={styles.listItem}
          />
          <ListItem 
            key="findmatches"
            title="Find matches on this place"
            titleStyle={styles.title}
            leftIcon={{name:'near-me'}}
            containerStyle={styles.listItem}
            onPress={() => navigation.navigate('MatchesList')}
          />
          {
            contactList.map((l, i) => (
              <View style={styles.viewList}>
                <ListItem
                  key={i}
                  leftAvatar={{ source: { uri: l.avatar_url } }}
                  title={l.name}
                  titleStyle={styles.title}
                  subtitle={l.subtitle}
                  subtitleStyle={styles.subtitle}
                  containerStyle={styles.list}
                />
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
    height: 32,
  },
  searchInputText: {
    fontSize: theme.sizes.caption,
    color: theme.colors.gray
  },
  listItem: {
    width: width - 16,
    marginHorizontal: 8,
    borderBottomColor: theme.colors.lightGray,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewList: {
    width: width - 16,
    marginHorizontal: 8,
    shadowColor: '#b2bcf3',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,  
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
    elevation: 1.4,
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
    fontSize: theme.sizes.caption2,
    marginTop: 2,
    lineHeight: 16
  }
})
