import React from 'react'
import { KeyboardAvoidingView, requireNativeComponent, StyleSheet, Text, Platform } from 'react-native'
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../constants';  

const NativeMap = requireNativeComponent('MapViewManager')

class MapScreen extends React.Component {
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
                  Profile</Text>
            ),      
          headerRight: (
            <Icon
              name="ios-more" 
              size={24} 
              color={
                navigation.getParam('nightTheme') 
                ?
                theme.colors.white
                :
                theme.colors.blue
              }
              onPress={() => navigation.navigate('Profile')}
              style={
                Platform.OS === 'ios'
                ?
                {paddingVertical: 10, paddingHorizontal: 20}
                :
                {paddingVertical: 10, paddingHorizontal: 20, transform: [{ rotate: '90deg' }]}
                }
            />
          ),  
          headerLeft: (
            <Icon
                name="ios-arrow-back" 
                size={24} 
                color={
                    navigation.getParam('nightTheme') 
                    ?
                    theme.colors.white
                    :
                    theme.colors.blue
                  }
                    onPress={() => navigation.goBack()}
                style={{paddingVertical: 10, paddingHorizontal: 20,}}
            />
          ),
          headerStyle:  {
            backgroundColor: navigation.getParam('nightTheme') ? theme.colors.notBlack : theme.colors.white
          }
        };
      }    
  state = {
  };

  render() {
      return (
          <KeyboardAvoidingView style={this.props.appState.nightTheme ? styles.darkContainer : styles.container} behavior="padding">
            <NativeMap style={StyleSheet.absoluteFillObject} />
          </KeyboardAvoidingView>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.blueBackground,
  },
  darkContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: theme.colors.notBlack,
  },
  headerText: {
    marginLeft: "auto", 
    marginRight: "auto",
    fontSize: 14, 
    fontWeight: '600', 
    letterSpacing: -0.0241176,
    color: theme.colors.notBlack,
  },
  darkHeaderText: {
      marginLeft: "auto", 
      marginRight: "auto",
      fontSize: 14, 
      fontWeight: '600', 
      letterSpacing: -0.0241176,
      color: theme.colors.white,
  },    
})

function mapStateToProps (state) {
    return {
      appState: state.appState,
    }
}

export default connect(mapStateToProps)(MapScreen)