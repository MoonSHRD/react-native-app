import React, { Component } from 'react';
import { Platform, View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet, DeviceEventEmitter } from 'react-native';

import {BoxShadow} from 'react-native-shadow';
import Icon from 'react-native-vector-icons/Ionicons';
import TimeAgo from 'react-native-timeago';
import { SearchBar, ListItem, ThemeConsumer } from 'react-native-elements';
import { theme } from '../constants';
import { Text, Block } from '../components';

import {connect} from 'react-redux';
import { getContactList, searchBar, changeContactList, clearSearchBar, selectContact, deselectContact, getMyUserId, getMyUserProfile, searchUserById } from '../store/actions/contactsActions';
import { getCurrentTopics, getChatMembers } from '../store/actions/p2chatActions';

const { width, height } = Dimensions.get('window');

class P2ChatListMembers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchChanged: false,
      search: '',
      screenHeight: height,
    };
  }

  static navigationOptions = ({ navigation }) => {
    const chatName = navigation.getParam('chatName', '')
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
        {chatName} members</Text>
      ),
      headerRight: (
        <Icon
          name="ios-person" 
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


  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  setHeaderParams = () => {
    this.props.navigation.setParams({nightTheme: this.props.appState.nightTheme});  
  }

  componentDidMount() {
    this.setHeaderParams()
    this.willFocus = this.props.navigation.addListener('willFocus', () => {
        const chatName = this.props.navigation.getParam('chatName', '')
        this.props.getMyUserId()
        this.props.getMyUserProfile()
        this.props.getCurrentTopics()
        this.props.getChatMembers(chatName)
    });    
  }

  componentDidUpdate(prevProps) {
    if (prevProps.appState.nightTheme !== this.props.appState.nightTheme) {
      this.setHeaderParams()
    }  
  }


  updateSearch = async(text) => {
    await this.setState({ search: text , searchChanged: true});
    if (this.state.search == '') {
      if (this.props.contacts.searchChanged) {
        await this.props.clearSearchBar();
        await this.props.loadDirectChats();  
      }
    }

      const newData = await this.props.contacts.contactList.filter((item)=>{
        const itemData = item.name.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData)>-1
      });
      await this.props.searchBar(text)
      await this.props.changeContactList(newData) 
  };

  handleSearch = async (text) => {
    await this.setState({ search: text , searchChanged: true});
    if (this.state.search == '') {
        if (this.state.searchChanged) {
          await this.props.clearSearchBar();
          await this.props.loadDirectChats();    
          await this.setState({searchChanged: false});
        }
    } else {
        await this.props.searchBar(text);
        await this.props.searchUserById(text);  
    }
  }
  
  capitalize(props) {
    let text = props.slice(0,1).toUpperCase() + props.slice(1, props.length);
    return text
  }

  parseAvatarUrl(props) {
    if (props != null) {
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
}

parseUserId(props) {
  if (props != null) {
    if (props != '') {
      let parts = props.split('@', 2);
      let userId  = parts[1];
      let userIdParts = userId.split(':', 2)
      let firstPart = userIdParts[0]
      return this.capitalize(firstPart)
    }
  }
}

  render() {
    const { navigation } = this.props;
    const { loading, errors, searchChanged } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 200;

    const shadowOpt = {
      width: width - 16,
			height: 64,
			color:"#b2bcf3",
			border:7,
			radius:16,
			opacity:0.2,
			x:0,
			y:0,
    }

    const darkShadowOpt = {
      color: '#1F1F1F',
      width: width - 16,
      height: 64,
      border:7,
			radius:16,
			opacity:1,
			x:0,
			y:0,
    }

    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
          style={this.props.appState.nightTheme ? styles.darkBackground : styles.background}
        >
        { Platform.OS === 'ios'
          ? 
          <SearchBar 
            placeholder="Search"
            onChangeText={(text) => this.handleSearch(text)}
            platform="ios"
            value={this.props.contacts.search}
            containerStyle={this.props.appState.nightTheme ? styles.darkSearchBar: styles.searchBar}
            inputContainerStyle={this.props.appState.nightTheme ? styles.darkSearchInputBar : styles.searchInputBar}
            inputStyle={this.props.appState.nightTheme ? styles.darkSearchInputText : styles.searchInputText}
          />
          :
          <SearchBar 
            placeholder="Search"
            platform="ios"
            onChangeText={(text) => this.handleSearch(text)}
            cancelButtonTitle={null}
            value={this.props.contacts.search}
            containerStyle={this.props.appState.nightTheme ? styles.darkSearchBar: styles.searchBar}
            inputContainerStyle={this.props.appState.nightTheme ? styles.darkSearchInputBar : styles.searchInputBar}
            inputStyle={this.props.appState.nightTheme ? styles.darkSearchInputText : styles.searchInputText}
          />
        }
        <View style={{marginBottom: 110,}}>
          {
            searchChanged
            ?
            <Block>
            {
              this.props.contacts.searchList.length > 0
              ?
              <Block>
              {
                this.props.contacts.searchList.map((l, i) => (
                  <View style={this.props.appState.nightTheme ? styles.darkViewList : styles.viewList}>
                  <BoxShadow setting={this.props.appState.nightTheme ? darkShadowOpt : shadowOpt}>
                    <ListItem
                      key={i}
                      leftAvatar={
                        l.avatarUrl
                        ?
                        { source: { uri: this.parseAvatarUrl(l.avatarUrl) } }
                        :
                        { title: l.name[0], titleStyle:{textTransform: 'capitalize'} }
                      }
                      title={
                        l.name[0] == '@'
                        ?
                        this.parseUserId(l.name)
                        :
                        this.capitalize(l.name)
                      }
                      titleStyle={this.props.appState.nightTheme ? styles.darkTitle : styles.title}
                      containerStyle={this.props.appState.nightTheme ? styles.darkList : styles.list}
                      onPress={() => {
                        this.props.navigation.navigate('Profile', {
                          userName: l.name,
                          userIdName: this.parseUserId(l.userId),
                          userId: l.userId,
                          avatarLink: this.parseAvatarUrl(l.avatarUrl),
                          roomId: l.roomId,
                          from: 'search',
                        })
                      }}  
                    />
                    </BoxShadow>
                    </View>
                ))
              }  
              </Block>  
              :
              null
            }
            </Block>
            :
            <Block>
            <Block>
            <View style={this.props.appState.nightTheme ? styles.darkViewList : styles.viewList}>
            <BoxShadow setting={this.props.appState.nightTheme ? darkShadowOpt : shadowOpt}>
                <ListItem
                    key={'myProfile'}
                    leftAvatar={
                    (this.props.contacts.myProfile.avatarUrl == "")
                    ?
                    { title: this.props.contacts.myProfile.name[0], titleStyle:{textTransform: 'capitalize'} }
                    :
                    { source: { uri: this.parseAvatarUrl(this.props.contacts.myProfile.avatarUrl) } }
                    }
                    title={
                    this.props.contacts.myProfile.name[0] == '@'
                    ?
                    this.parseUserId(this.props.contacts.myProfile.name)
                    :
                    this.capitalize(this.props.contacts.myProfile.name)
                    }
                    titleStyle={this.props.appState.nightTheme ? styles.darkTitle : styles.title}
                    subtitle={this.props.contacts.myProfile.isActive ? "Online" : <Text style={styles.subtitle}>Last seen <TimeAgo time={this.props.contacts.myProfile.lastSeen} interval={60000}/></Text>}
                    subtitleStyle={styles.subtitle}
                    containerStyle={this.props.appState.nightTheme ? styles.darkList : styles.list}
                    onPress={() => {
                    navigation.navigate('Profile')
                }}
                />
            </BoxShadow>
            </View>
            </Block>
            <Block>
            {
              this.props.p2chat.chatMembers.map((l, i) => (
                <View style={this.props.appState.nightTheme ? styles.darkViewList : styles.viewList}>
                <BoxShadow setting={this.props.appState.nightTheme ? darkShadowOpt : shadowOpt}>
                  {
                    l.name[0] == '@'
                    ?
                    <ListItem
                      key={i}
                      leftAvatar={
                        (l.avatarUrl == "")
                        ?
                        { title: l.name[1], titleStyle:{textTransform: 'capitalize'} }
                        :
                        { source: { uri: this.parseAvatarUrl(l.avatarUrl) } }
                      }
                      title={
                        l.name[0] == '@'
                        ?
                        this.parseUserId(l.name)
                        :
                        this.capitalize(l.name)
                      }
                      titleStyle={this.props.appState.nightTheme ? styles.darkTitle : styles.title}
                      subtitle={l.isActive ? "Online" : <Text style={styles.subtitle}>Last seen <TimeAgo time={l.lastSeen} interval={60000}/></Text>}
                      subtitleStyle={styles.subtitle}
                      containerStyle={this.props.appState.nightTheme ? styles.darkList : styles.list}
                      onPress={() => {
                        navigation.navigate('Profile', {
                          userName: this.parseUserId(this.capitalize(l.name)),
                          userIdName: this.parseUserId(l.userId),
                          userId: l.userId,
                          avatarLink: this.parseAvatarUrl(l.avatarUrl),
                          roomId: l.roomId,
                        })
                    }}
                    />
                    :
                    <ListItem
                      key={i}
                      leftAvatar={
                        (l.avatarUrl == "")
                        ?
                        { title: l.name[0], titleStyle:{textTransform: 'capitalize'} }
                        :
                        { source: { uri: this.parseAvatarUrl(l.avatarUrl) } }
                      }
                      title={
                        l.name[0] == '@'
                        ?
                        this.parseUserId(l.name)
                        :
                        this.capitalize(l.name)
                      }
                      titleStyle={this.props.appState.nightTheme ? styles.darkTitle : styles.title}
                      subtitle={l.isActive ? "Online" : <Text style={styles.subtitle}>Last seen <TimeAgo time={l.lastSeen} interval={60000}/></Text>}
                      subtitleStyle={styles.subtitle}
                      containerStyle={this.props.appState.nightTheme ? styles.darkList : styles.list}
                      onPress={() => {
                        navigation.navigate('Profile', {
                          userName: l.name,
                          userIdName: this.parseUserId(l.userId),
                          userId: l.userId,
                          avatarLink: this.parseAvatarUrl(l.avatarUrl),
                          roomId: l.roomId,
                        })
                    }}
                    />
                  }
                  </BoxShadow>
                  </View>
              ))
            }
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
    fontSize: 14, 
    fontWeight: '600', 
    letterSpacing: -0.0241176,
    color: theme.colors.notBlack,
  },
  darkHeaderText: {
      fontSize: 14, 
      fontWeight: '600', 
      letterSpacing: -0.0241176,
      color: theme.colors.white,
  },    
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
  darkSearchBar: {
    backgroundColor: theme.colors.notBlack,
    paddingHorizontal: 16,
    paddingVertical: 8,
    margin: 0
  },
  darkSearchInputBar: {
    backgroundColor: theme.colors.darkGrey,
    margin: 0,
    borderWidth: 0,
    borderRadius: 16,
    height: 32,
  },
  darkSearchInputText: {
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
    zIndex: 10,
  },
  darklistItem: {
    width: width - 16,
    marginHorizontal: 8,
    borderBottomColor: theme.colors.notBlack,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
    backgroundColor: theme.colors.black,
  },
  viewList: {
    width: width - 16,
    marginTop: 2,
    marginHorizontal: 8,
    shadowColor: '#b2bcf3',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,  
    minHeight: 64,
  },
  darkViewList: {
    width: width - 16,
    marginTop: 2,
    marginHorizontal: 8,
    shadowColor: '#b2bcf3',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,  
    minHeight: 64,
    backgroundColor: theme.colors.black,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
    minHeight: 64,
  },  
  darkList: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
    minHeight: 64,
    backgroundColor: theme.colors.black,
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
  },
  darkTitle: {
    color: theme.colors.white,
    fontSize: theme.sizes.headline,
    fontWeight: "600",
    letterSpacing: -0.0241176,
    lineHeight: 24,
  },
  grayTitle: {
    color: theme.colors.gray,
    fontSize: theme.sizes.headline,
    fontWeight: "600",
    letterSpacing: -0.0241176,
    lineHeight: 24,
  }
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
    loadDirectChats: () => dispatch(getContactList()),
    searchBar: (data) => dispatch(searchBar(data)),
    changeContactList: (data) => dispatch(changeContactList(data)),
    clearSearchBar: () => dispatch(clearSearchBar()),
    getMyUserId: () => dispatch(getMyUserId()),
    getMyUserProfile: () => dispatch(getMyUserProfile()),
    searchUserById: (data) => dispatch(searchUserById(data)),
    getChatMembers: (data) => dispatch(getChatMembers(data)),
    getCurrentTopics: () => dispatch(getCurrentTopics())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(P2ChatListMembers)