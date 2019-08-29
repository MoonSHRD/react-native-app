import React, { Component } from 'react';
import { Image, Platform, View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Block, Text, Input } from '../components';
import { theme } from '../constants';
import { Avatar, ThemeConsumer } from 'react-native-elements';

import {connect} from 'react-redux';
import { getContactInfo, deselectContact, getMyUserProfile } from '../store/actions/contactsActions';

const { width, height } = Dimensions.get('window');

class Profile extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
        headerTitle: (
            <Text notBlack style={{fontSize: 14, fontWeight: '600', letterSpacing: -0.0241176}}>Profile</Text>
        ),      
      headerRight: (
        <Icon
          name="ios-more" 
          size={24} 
          color={theme.colors.blue}
          onPress={() => navigation.navigate('Profile')}
          style={{paddingVertical: 10, paddingHorizontal: 20,}}
        />
      ),  
      headerLeft: (
        <Icon
            name="ios-arrow-back" 
            size={24} 
            color={theme.colors.blue}
            onPress={() => navigation.goBack()}
            style={{paddingVertical: 10, paddingHorizontal: 20,}}
        />
      )
    }
  };
  state = {
      userName:'',
      avatarUrl: '',
      name: 'Andrew Shoagase',
      phone: '+1(323)564-34-22',
      tags: [
          {
            name: 'Bikes',
            matched: true,
          },
          {
            name: 'Marvel',
            matched: false,
          },
          {
              name: 'DC Comix',
              matched: true,

          },
          {
            name: 'Buzrum',
            matched: true
          },
          {
            name: 'Progressive Black Metal',
            matched: false
          },
        ],
      newTag: null,
      errors: [],
      suggestedTags: [
        {
            name: 'Cost',
            matched: false
        },
        {
            name: 'Cosplay',
            matched: false,
        },
        {
            name: 'Cosmopolitan',
            matched: false 
        },  
        {
            name: 'Costume',
            matched: false,
        },
        {
            name: 'Costumes',
            matched: false,
        },
      ]
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  loadProfile = async () => {
    const userID = await this.props.navigation.getParam('userID', 'userID');
    await console.log(userID)
    await this.props.getContactInfo(userID.toLowerCase())
    await this.checkName()
  }

  checkName = async () => {
    await console.log('wwwww');
    const userName = await this.props.navigation.getParam('userName', 'userName');
    if (userName != 'userName') {
        var result = await this.capitalize(userName)
        await this.setState({name: result})
    }
  }
  
  capitalize(props) {
    let text = props.slice(0,1).toUpperCase() + props.slice(1, props.length);
    return text
  }

  loadMyProfile = async () => {
    await this.props.getMyUserProfile()
  }

  componentDidMount() {
    this.willFocus = this.props.navigation.addListener('willFocus', async () => {
        const userName = await this.props.navigation.getParam('userName', 'userName')
        await (userName != 'userName')
        ?
        this.loadProfile()
        :
        this.loadMyProfile()
    })  
}

  render() {
    const { navigation } = this.props;
    const { loading, errors, name, phone, tags, newTag, suggestedTags } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 100;
    const userName = this.props.navigation.getParam('userName', 'userName')

    return (
      <KeyboardAvoidingView behavior="padding" >
        <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={scrollEnabled}
            onContentSizeChange={this.onContentSizeChange}
        >
        {
            (userName != 'userName')
            ?
            <Block style={styles.container}>
            <Image 
                source={require('../assets/images/backgroundImage.png')} 
                style={styles.backgroundImage}
            />
            <Block style={styles.avatarContainer}>
            {
                this.props.contacts.contact.avatarUrl != ''
                ?
                <Avatar 
                    rounded
                    source={this.props.contacts.contact.avatarUrl}
                    containerStyle={styles.avatar}
                    avatarStyle={styles.avatarImage}
                />
                :
                <Avatar 
                    rounded
                    title={
                        this.props.contacts.contact.name != ''
                        ?
                        this.capitalize(this.props.contacts.contact.name[1])
                        :
                        this.capitalize(userName[0])
                    }
                    containerStyle={styles.avatar}
                    avatarStyle={styles.avatarImage}
                />
            }
            </Block>
            <Block style={styles.profileContainer}>
                <Input
                    editable={false}
                    label="Name"
                    labelStyle={[styles.labels, hasErrors('name')]}
                    error={hasErrors('name')}
                    style={[styles.input, hasErrors('name')]}
                    defaultValue={
                        this.props.contacts.contact.name != ''
                        ?
                        this.props.contacts.contact.name
                        :
                        this.state.name 
                    }
                />
                {
                    this.props.contacts.contact.phone
                    ?
                    <Input
                        editable={false}
                        label="Phone Nymber"
                        labelStyle={[styles.labels, hasErrors('name')]}
                        error={hasErrors('phone')}
                        style={[styles.input, hasErrors('phone')]}
                        defaultValue={this.props.contacts.contact.phone}
                    />
                    :
                    null
                }
                {
                    this.props.contacts.contact.email
                    ?
                    <Input
                        email
                        editable={false}
                        label="Email"
                        labelStyle={[styles.labels, hasErrors('email')]}
                        error={hasErrors('email')}
                        style={[styles.input, hasErrors('email')]}
                        defaultValue={this.props.contacts.contact.email}
                    />
                    :
                    null
                }
                {
                    (this.props.contacts.contact.tags) 
                    ?
                    <Block>
                        <Text subhead gray style={{marginTop:20}}>Tags</Text>
                        <Block style={styles.tagContainer}>
                        {
                            this.props.contacts.contact.tags.map((l,i) => (
                                    l.matched
                                    ?
                                    <Button
                                        key={i}
                                        style={styles.matchedTag}>
                                        <Text caption white center>{l.name}</Text>
                                    </Button>
                                    :
                                    <Button
                                        key={i}
                                        style={styles.dismatchedTag}>
                                        <Text caption blue center>{l.name}</Text>
                                    </Button>
                            ))
                        }
                        </Block>  
                    </Block>  
                    :
                    null
                }
            </Block>
            </Block>
            :
            <Block style={styles.container}>
            <Image 
                source={require('../assets/images/backgroundImage.png')} 
                style={styles.backgroundImage}
            />
            <Block style={styles.avatarContainer}>
            {
                this.props.contacts.myProfile.avatarUrl != ''
                ?
                <Avatar 
                    rounded
                    source={this.props.contacts.myProfile.avatarUrl}
                    containerStyle={styles.avatar}
                    avatarStyle={styles.avatarImage}
                />
                :
                <Avatar 
                    rounded
                    title={
                        this.props.contacts.myProfile.name != ''
                        ?
                        this.props.contacts.myProfile.name
                        :
                        this.capitalize(this.props.contacts.myUserName[0])
                    }
                    containerStyle={styles.avatar}
                    avatarStyle={styles.avatarImage}
                />
            }
            </Block>
            <Block style={styles.profileContainer}>
                <Input
                    label="Name"
                    labelStyle={[styles.labels, hasErrors('name')]}
                    error={hasErrors('name')}
                    style={[styles.input, hasErrors('name')]}
                    defaultValue={
                        this.props.contacts.myUserName
                        ?
                        this.capitalize(this.props.contacts.myUserName)
                        :
                        this.state.name
                    }
                    onChangeText={text => this.setState({ name: text })}
                />
                <Input
                    label="Phone Nymber"
                    labelStyle={[styles.labels, hasErrors('name')]}
                    error={hasErrors('phone')}
                    style={[styles.input, hasErrors('phone')]}
                    defaultValue={phone}
                    onChangeText={text => this.setState({ phone: text })}
                />
                <Text subhead gray style={{marginTop:20}}>My Tags</Text>
                <Block style={styles.tagContainer}>
                {
                    tags.map((l,i) => (
                            l.matched
                            ?
                            <Button
                                key={i}
                                style={styles.matchedTag}>
                                <Text caption white center>{l.name}</Text>
                            </Button>
                            :
                            <Button
                                key={i}
                                style={styles.dismatchedTag}>
                                <Text caption blue center>{l.name}</Text>
                            </Button>
                    ))
                }
                </Block>
                <Input
                    error={hasErrors('tags')}
                    style={[styles.input, hasErrors('tags')]}
                    placeholder={'Enter New Tag'}
                    defaultValue={newTag}
                    onChangeText={text => this.setState({ newTag: text })}
                />
                {
                    newTag !== null 
                    ?
                    <Block style={styles.newTagContainer}>
                        <Text caption2 gray style={styles.suggestedTagsText}>Suggested tags</Text>
                        <Block style={styles.newTagList}>
                            {
                                suggestedTags.map((l,i) => (
                                    l.matched
                                    ?
                                    <Button
                                        key={i}
                                        style={styles.matchedTag}>
                                        <Text caption white center>{l.name}</Text>
                                    </Button>
                                    :
                                    <Button
                                        key={i}
                                        style={styles.dismatchedTag}>
                                        <Text caption blue center>{l.name}</Text>
                                    </Button>
                                ))
                            }
                        </Block>
                    </Block>
                    :
                    null
                }
                <Button gradient style={styles.confirmButton}               
                    onPress={() => {Alert.alert('save profile')}}
                >
                    {loading ?
                    <ActivityIndicator size="small" color="white" /> :
                    <Text headline bold white center>Save</Text>
                    }
                </Button>       
            </Block>
        </Block>
        }
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        margin: 0,
        marginBottom: 15,
    },
    backgroundImage: {
        width: width,
        height: 96,
        margin: 0,
        padding: 0
    },
    avatarContainer: {
        position: 'absolute', 
        top: 35,
        width: width,
        alignItems: 'center'
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        overflow: 'hidden',
        borderColor: 'white',
        borderStyle: 'solid',
        borderWidth: 3,
    },
    profileContainer: {
        width: width - 72,
        marginHorizontal: 32,
        marginTop: 24,
    },
    input: {
        borderWidth: 0,
        backgroundColor: '#FAFAFA',
        borderRadius: 8,
        fontSize: theme.sizes.body,
        marginTop: 8,
        padding: 12,
        color: theme.colors.notBlack,
    }, 
    labels: {
        fontSize: theme.sizes.subhead,
        color: theme.colors.gray,
        letterSpacing: -0.016,
        lineHeight: 20,
        marginTop: 15,
    },
    tagContainer: {
        flexDirection: "row",
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        marginTop: 8,
    },  
    matchedTag: {
        backgroundColor: theme.colors.blue,
        borderRadius: 16,
        overflow: 'hidden',
        height: 24,
        paddingVertical: 4,
        paddingHorizontal: 16,
        marginHorizontal: 2,
    },
    dismatchedTag: {
        backgroundColor: theme.colors.white,
        borderRadius: 16,
        overflow: 'hidden',
        height: 24,
        paddingVertical: 4,
        paddingHorizontal: 16,
        marginHorizontal: 2,
        borderWidth: 1,
        borderColor: theme.colors.blue,
    },
    newTagContainer: {
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 8,
        marginTop: 20,
    },
    suggestedTagsText: {
        paddingTop: 8,
    },
    newTagList: {
        flexDirection: "row",
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        paddingTop: 11,
    },
    confirmButton: {
        marginTop: 20,
    }
})

function mapStateToProps (state) {
    return {
      contacts: state.contacts
    }
  }
  
  function mapDispatchToProps (dispatch) {
    return {
      getContactInfo: (data) => dispatch(getContactInfo(data)),
      deselectContact: () => dispatch(deselectContact()),
      getMyUserProfile: () => dispatch(getMyUserProfile())
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Profile)