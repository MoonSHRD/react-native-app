import React, { Component } from 'react';
import { Platform, View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import {BoxShadow} from 'react-native-shadow';
import Moment from 'react-moment';
import TimeAgo from 'react-native-timeago';
import Icon from 'react-native-vector-icons/Ionicons';
import { Badge, SearchBar, ListItem } from 'react-native-elements';
import { theme } from '../constants';
import { Text, Block } from '../components';

import {connect} from 'react-redux';
import { getContactList, searchBar, changeContactList, clearSearchBar } from '../store/actions/contactsActions';



const { width, height } = Dimensions.get('window');

class ChatList extends Component {
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
        Chatlist</Text>
      ),
      headerLeft: (
        <Icon
          name="ios-create" 
          size={24} 
          color={
            navigation.getParam('nightTheme') 
            ?
            theme.colors.white
            :
            theme.colors.blue
          }
          onPress={() => navigation.navigate('NewChat')}
          style={{paddingVertical: 10, paddingHorizontal: 20,}}
        />
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
    }
  };
  state = {
    searchChanged: false,
    search: '',
    screenHeight: height,
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  setHeaderParams = () => {
    this.props.navigation.setParams({nightTheme: this.props.appState.nightTheme});  
  }

  componentDidMount() {
    this.setHeaderParams()
    this.willFocus = this.props.navigation.addListener('willFocus', () => {
      this.props.loadDirectChats()
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.appState.nightTheme !== this.props.appState.nightTheme) {
      this.setHeaderParams()
    }  
  }

  capitalize(props) {
    let text = props.slice(0,1).toUpperCase() + props.slice(1, props.length);
    return text
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
  
  render() {
    const { navigation } = this.props;
    const { loading, errors, searchChanged } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 100;

    const calendarStrings = {
      lastDay : 'H:m',
      sameDay : 'LT',
      lastWeek : 'ddd',
      sameElse : 'D.MM',
  };

    const shadowOpt = {
      width: width - 16,
			height: 74,
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
            onChangeText={(text) => this.updateSearch(text)}
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
            onChangeText={(text) => this.updateSearch(text)}
            cancelButtonTitle={null}
            value={this.props.contacts.search}
            containerStyle={this.props.appState.nightTheme ? styles.darkSearchBar: styles.searchBar}
            inputContainerStyle={this.props.appState.nightTheme ? styles.darkSearchInputBar : styles.searchInputBar}
            inputStyle={this.props.appState.nightTheme ? styles.darkSearchInputText : styles.searchInputText}
          />
        }
        <View style={{marginTop: 5}}>
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
                    (l.avatarUrl == "")
                    ?
                    { title: l.name[0], titleStyle:{textTransform: 'capitalize'}, containerStyle: { width: 48, height: 48, borderRadius: 50, overflow: 'hidden' } }
                    :
                    { source: { uri: l.avatarUrl }, containerStyle: { width: 48, height: 48, borderRadius: 50, overflow: 'hidden' } }
                    }
                    title={this.capitalize(l.name)}
                    titleStyle={this.props.appState.nightTheme ? styles.darkTitle : styles.title}
                    rightTitle={
                      <Moment element={Text} calendar={calendarStrings} style={styles.dateTag}>{new Date(l.lastSeen)}</Moment>
                    }
                    rightTitleStyle={styles.dateTag}
                    subtitle={
                      l.lastMessage == "" 
                      ?
                      l.isActive ? "Online" : <Text style={styles.subtitle}>Last seen <TimeAgo time={l.lastSeen} interval={60000}/></Text>
                      :
                      l.lastMessage
                    }
                    subtitleStyle={styles.subtitle}
                    containerStyle={this.props.appState.nightTheme ? styles.darkList : styles.list}
                    onPress={(navigation) => {
                      this.props.navigation.navigate('Chat', {
                        userName: this.capitalize(l.name),
                        userId: l.userId,
                        avatar: l.avatarUrl,
                        isActive: l.isActive,
                        lastSeen: l.lastSeen,
                      })
                    }}  
                    />
                  {
                    l.unreadMessagesCount > 0 
                    ?
                    <Badge 
                      value={l.unreadMessagesCount} 
                      status="error" 
                      badgeStyle={{ width: 24, height: 24, borderRadius: 50, overflow: 'hidden', borderColor:'green'}}
                      containerStyle={{ position: 'absolute', top: 36, right: 16, }}
                      textStyle={{fontSize: 12}}
                    />
                    :
                    null
                  }
                  {
                    (l.isActive) 
                    ? 
                    <Badge 
                      status="primary" 
                      badgeStyle={{width: 12, height: 12, overflow: 'hidden', borderRadius: 50, backgroundColor: theme.colors.blue}}
                      containerStyle={{ position: 'absolute', top: 48, left: 52}}
                    />
                    :
                    null
                  }
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
          {
            this.props.contacts.contactList.map((l, i) => (
              <View style={this.props.appState.nightTheme ? styles.darkViewList : styles.viewList}>
              <BoxShadow setting={this.props.appState.nightTheme ? darkShadowOpt : shadowOpt}>
                <ListItem
                  key={i}
                  leftAvatar={
                  (l.avatarUrl == "")
                  ?
                  { title: l.name[0], titleStyle:{textTransform: 'capitalize'}, containerStyle: { width: 48, height: 48, borderRadius: 50, overflow: 'hidden' } }
                  :
                  { source: { uri: l.avatarUrl }, containerStyle: { width: 48, height: 48, borderRadius: 50, overflow: 'hidden' } }
                  }
                  title={this.capitalize(l.name)}
                  titleStyle={this.props.appState.nightTheme ? styles.darkTitle : styles.title}
                  rightTitle={
                    <Moment element={Text} calendar={calendarStrings} style={styles.dateTag}>{new Date(l.lastSeen)}</Moment>
                  }
                  rightTitleStyle={styles.dateTag}
                  subtitle={
                    l.lastMessage == "" 
                    ?
                    l.isActive ? "Online" : <Text style={styles.subtitle}>Last seen <TimeAgo time={l.lastSeen}/></Text>
                    :
                    l.lastMessage
                  }
                  subtitleStyle={styles.subtitle}
                  containerStyle={this.props.appState.nightTheme ? styles.darkList : styles.list}
                  onPress={(navigation) => {
                    this.props.navigation.navigate('Chat', {
                      userName: this.capitalize(l.name),
                      userId: l.userId,
                      avatar: l.avatarUrl,
                      isActive: l.isActive,
                      lastSeen: l.lastSeen,
                    })
                  }}  
                />
                {
                  l.unreadMessagesCount > 0 
                  ?
                  <Badge 
                    value={l.unreadMessagesCount} 
                    status="error" 
                    badgeStyle={{ width: 24, height: 24, borderRadius: 50, overflow: 'hidden'}}
                    containerStyle={{ position: 'absolute', top: 36, right: 16}}
                    textStyle={{fontSize: 12}}
                  />
                  :
                  null
                }
                {
                  (l.isActive) 
                  ? 
                  <Badge 
                    status="primary" 
                    badgeStyle={{width: 12, height: 12, overflow: 'hidden', borderRadius: 50, backgroundColor: theme.colors.blue}}
                    containerStyle={{ position: 'absolute', top: 48, left: 52}}
                  />
                  :
                  null
                }
                </BoxShadow>
                </View>
            ))
          }  
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
  viewList: {
    width: width - 16,
    marginTop: 2,
    marginHorizontal: 8,
    shadowColor: '#b2bcf3',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,  
    minHeight: 74,
  },
  darkViewList: {
    width: width - 16,
    marginTop: 2,
    marginHorizontal: 8,
    shadowColor: '#b2bcf3',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 7,  
    minHeight: 74,
    backgroundColor: theme.colors.black,
  },
  list: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
    minHeight: 74,
  },  
  darkList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    overflow: 'hidden',
    minHeight: 74,
    backgroundColor: theme.colors.black,
  },
  title: {
    color: theme.colors.notBlack,
    fontSize: theme.sizes.headline,
    fontWeight: "600",
    letterSpacing: -0.0241176,
    lineHeight: 24,
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

function mapStateToProps (state) {
  return {
    contacts: state.contacts,
    appState: state.appState,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadDirectChats: () => dispatch(getContactList()),
    searchBar: (data) => dispatch(searchBar(data)),
    changeContactList: (data) => dispatch(changeContactList(data)),
    clearSearchBar: () => dispatch(clearSearchBar()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatList)