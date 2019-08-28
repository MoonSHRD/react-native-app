import React, { Component } from 'react';
import { Image, Platform, View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Block, Text, Input } from '../components';
import { theme } from '../constants';
import { Avatar, ThemeConsumer } from 'react-native-elements';

import {connect} from 'react-redux';
import { getContactInfo } from '../store/actions/contactsActions';

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
    var userId = this.props.contacts.selectedContact.toLowerCase()
    console.log(userId)
    await this.props.getContactInfo(userId)
    await this.checkName()
  }

  checkName = async () => {
    if (this.props.contacts.contact.name == null) {
        var userName = await this.props.contacts.selectedContact.substring(0, this.props.contacts.selectedContact.indexOf(":matrix.moonshard.tech"));       
        var parsedName = userName.substring(1,)
        var result = this.capitalize(parsedName)
        this.setState({name: result})
    } else {
        var result = await this.props.contacts.contact.name
        this.setState({name: result})
    }
  }
  
  capitalize(props) {
    let text = props.slice(0,1).toUpperCase() + props.slice(1, props.length);
    return text
  }        

  loadMyProfile = async () => {
    var sign = '@'
    var serverInfo = ':matrix.moonshard.tech'
    var userId = sign + this.props.contacts.myUserName.toLowerCase() + serverInfo
    await this.props.getContactInfo(userId)
    var result = await this.capitalize(this.props.contacts.myUserName)
    this.setState({name: result})
  }

  componentDidMount() {
      (this.props.contacts.selectedContact != null)
      ?
      this.loadProfile()
      :
      this.loadMyProfile()
}

  render() {
    const { navigation } = this.props;
    const { loading, errors, name, phone, tags, newTag, suggestedTags } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 100;

    return (
      <KeyboardAvoidingView behavior="padding" >
        <ScrollView
            showsVerticalScrollIndicator={false}
            scrollEnabled={scrollEnabled}
            onContentSizeChange={this.onContentSizeChange}
        >
        {
            (this.props.contacts.selectedContact != null)
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
                        this.props.contacts.contact.name
                        :
                        this.capitalize(this.props.contacts.selectedContact[1])
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
                        this.props.contacts.contact.name
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
    }
  }
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(Profile)