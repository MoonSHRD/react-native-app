import React from 'react';
import { StyleSheet, AsyncStorage, Dimensions, View, Alert } from 'react-native';
import {connect} from 'react-redux';

import { Block, Text, Button } from './components';
import { Overlay, Avatar } from 'react-native-elements';
import { theme } from './constants';
import { createRootNavigator } from "./navigation/router";
const { width, height } = Dimensions.get('window');

console.disableYellowBox = true;

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      signedIn: false,
      checkedSignIn: true,
      isLoadingComplete: false,
      visible: false,
      match: {
        name: 'Freddie Mercury',
        matches: 2,
        tags: [
          {
            name: 'Marvel',
            matched: true,
          },
          {
              name: 'DC Comix',
              matched: true,
          },
        ]
      }
    };
  }

  componentDidMount() {
    // this._isSignedInAsync()
    //   .then(res => this.setState({ signedIn: res, checkedSignIn: true }))
    //   .catch(err => alert("An error occurred"));
  }

//   _isSignedInAsync =  () => {
//     return new Promise((resolve, reject) => {
//     this.props.getUserToken()
//         .then(res => {
//           if (res !== null) {
//           resolve(true);
//           } else {
//           resolve(false);
//           }
//         })
//         .catch(err => reject(err));
//     });
// };

  render() {
    const { checkedSignIn, signedIn, visible, match, loading } = this.state;

    if (!checkedSignIn) {
      return null;
    }

    const Navigation = createRootNavigator(signedIn);
    return (
        <Block white>
          <Navigation />
          {
            visible 
            ?
              <Overlay 
                isVisible
                onBackdropPress={()=>{this.setState({visible: false})}}
                overlayStyle={styles.overlayContainer}
                borderRadius={16}
                height="auto"
              >
                <View style={styles.overlayWrapper}>
                  <Block style={styles.avatarContainer}>
                  <Avatar 
                      rounded
                      source={{
                          uri:
                          'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                      }}
                      containerStyle={styles.avatar}
                      avatarStyle={styles.avatarImage}
                  />
                  </Block>
                  <Text center h3 notBlack bold style={{marginTop:20}}>{match.name}</Text>
                  <Text center subhead notBlack style={{marginTop:8}}>You have a match by {match.matches} tags</Text>
                  <Block style={styles.tagContainer}>
                    {
                        match.tags.map((l,i) => (
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
                  <Block style={styles.buttonContainer}>
                    <Button gradient style={styles.confirmButton}               
                        onPress={() => {Alert.alert('close profile')}}
                    >
                        {loading ?
                        <ActivityIndicator size="small" color="white" /> :
                        <Text headline bold white center>Close</Text>
                        }
                    </Button>
                    <Button gradient style={styles.confirmButton}               
                        onPress={() => {Alert.alert('save profile')}}
                    >
                        {loading ?
                        <ActivityIndicator size="small" color="white" /> :
                        <Text headline bold white center>Save</Text>
                        }
                    </Button>       
                  </Block>
                  </View>
              </Overlay>
            :
            null
          }          
        </Block>
    );
  }
}

const styles = StyleSheet.create({
  avatarContainer: {
    position: 'absolute', 
    top: 35,
    width: width,
  },
  avatar: {
      width: 110,
      height: 110,
      borderRadius: 50,
      overflow: 'hidden',
      borderColor: 'white',
      borderStyle: 'solid',
      borderWidth: 3,
  },
  overlayContainer: {
    marginHorizontal: 64,
    paddingHorizontal: 14,
    paddingBottom: 15.67,
    flexDirection: 'column',
    alignSelf: 'center',
  },
  overlayWrapper: {
  },
  tagContainer: {
    flex:0,
    flexDirection: "row",
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginTop: 12,
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
  buttonContainer: {
    flex: 0,
    marginTop:15.67,
  }

});
