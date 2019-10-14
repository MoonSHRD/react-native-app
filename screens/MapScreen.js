import React from 'react'
import { View, requireNativeComponent, StyleSheet } from 'react-native'

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
          <View>
            <NativeMap style={StyleSheet.absoluteFillObject} />
          </View>
      )
  }
}


function mapStateToProps (state) {
    return {
      appState: state.appState,
    }
}

export default connect(mapStateToProps)(MapScreen)