import React, { Component } from 'react';
import { Platform, View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import {BoxShadow} from 'react-native-shadow';
import TimeAgo from 'react-native-timeago';
import { Block, Text } from '../components';
import { SearchBar, ListItem, ThemeConsumer } from 'react-native-elements';
import { theme } from '../constants';

import {connect} from 'react-redux';
import { getContactList, searchBar, changeContactList, clearSearchBar, selectChat } from '../store/actions/contactsActions';


const { width, height } = Dimensions.get('window');

class NewChat extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text notBlack style={{fontSize: 14, fontWeight: '600', letterSpacing: -0.0241176}}>New Chat</Text>
      ),
    }
  };

  state = {
    search: '',
    searchChanged: false,
    screenHeight: height,
  };

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  componentDidMount() {
    this.willFocus = this.props.navigation.addListener('willFocus', () => {
      this.props.getDirectChats();
    });
  }

  
  updateSearch = async(text) => {
    await this.setState({ search: text , searchChanged: true});

    if (this.state.search == '') {
      if (this.props.contacts.searchChanged) {
        await this.props.clearSearchBar();
        await this.props.getDirectChats();  
      }
    }

      const newData = await this.props.contacts.contactList.filter((item)=>{
        const itemData = item.name.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData)>-1
      });
      await this.props.updateSearchBar(text)
      await this.props.updateSearchList(newData) 
  };

  capitalize(props) {
    let text = props.slice(0,1).toUpperCase() + props.slice(1, props.length);
    return text
  }
  
  render() {
    const { navigation } = this.props;
    const { loading, errors, searchChanged } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 100;

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
            onChangeText={(text) => this.updateSearch(text)}
            platform="ios"
            value={this.props.contacts.search}
            containerStyle={styles.searchBar}
            inputContainerStyle={styles.searchInputBar}
            inputStyle={styles.searchInputText}
          />
          :
          <SearchBar 
            placeholder="Search"
            platform="ios"
            onChangeText={(text) => this.updateSearch(text)}
            cancelButtonTitle={null}
            value={this.props.contacts.search}
            containerStyle={styles.searchBar}
            inputContainerStyle={styles.searchInputBar}
            inputStyle={styles.searchInputText}
          />
        }
        <View>
          <ListItem 
            key="newgroupchat"
            title="Create group chat"
            titleStyle={styles.title}
            leftIcon={{name:'group-add'}}
            containerStyle={styles.listItem}
            onPress={()=> navigation.navigate('NewGroupChat')}
          />
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
                  <View style={styles.viewList}>
                  <BoxShadow setting={shadowOpt}>
                    <ListItem
                      key={i}
                      leftAvatar={
                        (l.avatarUri == "")
                        ?
                        { title: l.name[0], titleStyle:{textTransform: 'capitalize'} }
                        :
                        { source: { uri: l.avatarUri } }
                      }
                      title={this.capitalize(l.name)}
                      titleStyle={styles.title}
                      subtitle={l.isActive ? "Online" : <Text style={styles.subtitle}>Last seen <TimeAgo time={l.lastSeen}/></Text>}
                      subtitleStyle={styles.subtitle}
                      containerStyle={styles.list}
                      onPress={(navigation) => {
                        this.props.selectChat('@'+l.name+':matrix.moonshard.tech')
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
            {
              this.props.contacts.contactList.map((l, i) => (
                <View style={styles.viewList}>
                <BoxShadow setting={shadowOpt}>
                  <ListItem
                    key={i}
                    leftAvatar={
                      (l.avatarUri == "")
                      ?
                      { title: l.name[0], titleStyle:{textTransform: 'capitalize'} }
                      :
                      { source: { uri: l.avatarUri } }
                    }
                    title={this.capitalize(l.name)}
                    titleStyle={styles.title}
                    subtitle={l.isActive ? "Online" : <Text style={styles.subtitle}>Last seen <TimeAgo time={l.lastSeen} interval={60000}/></Text>}
                    subtitleStyle={styles.subtitle}
                    containerStyle={styles.list}
                    onPress={(navigation) => {
                      this.props.selectChat('@'+l.name+':matrix.moonshard.tech')
                    }}
                  />
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
    zIndex: 10,
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

function mapStateToProps (state) {
  return {
    contacts: state.contacts
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getDirectChats: () => dispatch(getContactList()),
    updateSearchBar: (data) => dispatch(searchBar(data)),
    updateSearchList: (data) => dispatch(changeContactList(data)),
    clearSearchBar: () => dispatch(clearSearchBar()),
    selectChat: (data) => dispatch(selectChat(data)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewChat)