import React, { Component } from 'react';
import { Image, Platform, View, Dimensions, Alert, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import MatrixLoginClient from '../native/MatrixLoginClient';

import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Block, Text, Input } from '../components';
import { theme } from '../constants';
import { Avatar, ThemeConsumer } from 'react-native-elements';

const { width, height } = Dimensions.get('window');

export default class Profile extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: (
        <Icon
          name="ios-more" 
          size={24} 
          color={theme.colors.blue}
          onPress={() => navigation.navigate('Profile')}
          style={{paddingVertical: 10, paddingHorizontal: 20,}}
        />
      ),  
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
      errors: []
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  render() {
    const { navigation } = this.props;
    const { loading, errors, name, phone, tags, newTag } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height;

    return (
      <KeyboardAvoidingView behavior="padding" >
        <ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={this.onContentSizeChange}
        >
        <Block 
            style={styles.container}
        >
            <Image 
                source={require('../assets/images/backgroundImage.png')} 
                style={styles.backgroundImage}
            />
            <View style={styles.avatarContainer}>
                <Avatar 
                    rounded
                    source={{
                        uri:
                        'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                    }}
                    containerStyle={styles.avatar}
                    avatarStyle={styles.avatarImage}
                />
            </View>
            <Block style={styles.profileContainer}>
                <Input
                    label="Name"
                    labelStyle={[styles.labels, hasErrors('name')]}
                    error={hasErrors('name')}
                    style={[styles.input, hasErrors('name')]}
                    defaultValue={name}
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
                <Text subhead gray>My Tags</Text>
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
                    onChangeText={text => this.setState({ tag: text })}
                />
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
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 0,
        margin: 0
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
    },
    tagContainer: {
        flexDirection: "row",
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        flexBasis: '55%',
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
    }
})