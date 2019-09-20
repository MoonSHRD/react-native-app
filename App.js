import React from 'react';
import { StyleSheet, AsyncStorage, Dimensions, View, Alert, TouchableHighlight } from 'react-native';
import {connect} from 'react-redux';

import { Block, Text, Button } from './components';
import { Overlay, Avatar } from 'react-native-elements';
import { theme } from './constants';
import { createRootNavigator } from "./navigation/router";
import { initAppWithRealm } from './store/actions/loginActions';
import { getCurrentTopics, getAllMatches } from './store/actions/p2chatActions';
const { width, height } = Dimensions.get('window');


console.disableYellowBox = true;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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

  initializeApp = async () =>  {
    const isRegistered = await this.props.initApplication()
    if (isRegistered) {
      this.props.getCurrentTopics()
      this.props.getAllMatches()  
    }
  }


  componentDidMount() {
    this.initializeApp()
  }

  render() {
    const { signedIn, checkedSignIn } = this.props.login;
    const { visible, match, loading } = this.state;

    if (!checkedSignIn) {
      return null
    }

    const Navigation = createRootNavigator(signedIn);
    return (
        <Block white>
          <Navigation 
            signedIn={signedIn} 
            handleChange={this.handleChange}
          />
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
                  <View style={{paddingHorizontal:14, marginTop: 42}}>
                  <Text center h3 notBlack bold style={{marginTop:20, marginHorizontal: 14}}>{match.name}</Text>
                  <Text center subhead notBlack style={{marginTop:8, marginHorizontal: 20}}>You have a match by {match.matches} tags</Text>
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
                    <Button style={styles.closeButton}               
                        onPress={()=>{this.setState({visible: false})}}
                    >
                        {loading ?
                        <ActivityIndicator size="small" color="white" /> :
                        <Text headline bold blue center>Close</Text>
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
    alignSelf: 'center',
    position: 'absolute',
    top: -55
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
    paddingBottom: 15.67,
    paddingHorizontal: 0,
    flexDirection: 'column',
    alignSelf: 'center',
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
  },
  closeButton: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.blue,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden'
  },
  text: {
    textAlign: 'center'
  },
  button: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b7eff'
  },
  buttonText: {
    color: 'white'
  }

});

function mapStateToProps (state) {
  return {
    login: state.login,
    p2chat: state.p2chat,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    initApplication: () => dispatch(initAppWithRealm()),
    getCurrentTopics: () => dispatch(getCurrentTopics()),
    getAllMatches: () => dispatch(getAllMatches()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)