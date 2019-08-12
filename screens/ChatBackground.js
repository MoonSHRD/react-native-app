import React, { Component } from 'react';
import { View, Alert, Platform, Dimensions, ActivityIndicator, ScrollView, Keyboard, KeyboardAvoidingView, StyleSheet, Image } from 'react-native';

import { Block, Text } from '../components';
import { theme } from '../constants';

const { width, height } = Dimensions.get('window');

export default class Settings extends Component {
  state = {
    chatBackground: null,
    dataSource: [
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        },
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        },
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        },
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',  
        },
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        },
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',  
        },
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        },
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        },
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        },
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',  
        },
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
        },
        {
            picture_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',  
        },
    ],
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({ screenHeight: contentHeight });
  };

  render() {
    const { navigation } = this.props;
    const { loading, errors, dataSource } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    const scrollEnabled = this.state.screenHeight > height - 48.5;

    return (
      <KeyboardAvoidingView behavior="padding">
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
          onContentSizeChange={this.onContentSizeChange}
        >
        <Block style={styles.settings}>
          <Block 
            forPress
            row 
            space="between" 
            style={styles.settingsItem}
            onPress={() => { Alert.alert('Gallery callback') }}
            >
            <Text body notBlack>Choose from gallery</Text>
          </Block>
          <View style={styles.imageContainer}>
            {
                dataSource.map((l,i) => (
                    <Block
                        forPress
                        style={styles.backgroundBlock}
                    >
                    <Image 
                        source={{url: l.picture_url}}
                        style={styles.backgroundPicture}
                    />
                    </Block>
                ))
            }
          </View>
            <Block 
                forPress
                row 
                space="between" 
                style={styles.lastItem}
                onPress={() => navigation.navigate('Settings')}
                >
                <Text body notBlack>Disable background settings</Text>
            </Block>
        </Block>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  settings: {
    width: width,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  settingsItem: {
    paddingVertical: 10,
    borderBottomColor: theme.colors.lightGray,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  lastItem: {
    paddingVertical: 10,
    borderBottomColor: theme.colors.lightGray,
    borderBottomWidth: 1,
    alignItems: 'center',
    marginBottom: 15,
  },
  imageContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 7,
      marginBottom: 22,
  },
  backgroundBlock: {
    marginVertical: 8,
  },
  backgroundPicture: {
      width: (width / 3) - 15,
      height: 201,
  },
})