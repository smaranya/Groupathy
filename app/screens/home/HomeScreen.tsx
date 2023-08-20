import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { TextView } from '../../components/atoms/TextView';
import { Colors } from '../../styles/colors';
import { FontStyles } from '../../styles/fonts/names';
import { Sizes } from '../../styles/fonts/sizes';
import { getSpace, Spaces } from '../../styles/spaces';
import { TouchableOpacity } from 'react-native-gesture-handler';

const HomeScreen = () => {
    const homeScreenImage = require('../../assets/homeScreen.png');
  return (
    <View style={styles.container}>
        <TouchableOpacity 
            style = {styles.touchable}
            onPress={()=>{console.log("Image Pressed!")}}>
        <ImageBackground style={styles.imgContainer} source={homeScreenImage}>
        <View style={styles.textContainer}>
          <TextView
            style={[styles.imgText, {fontSize: Sizes.xxxxLarge}]}
            textColor={{ color: Colors.black }}
            fontFamily={FontStyles.bold}>
            Do Events Yourself
          </TextView>
          <TextView
            style={[styles.imgText, {fontSize: Sizes.xxLarge}]}
            textColor={{ color: Colors.black }}
            fontFamily={FontStyles.regular}>
            Some Details about the Event
          </TextView>
        </View>
        </ImageBackground>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  imgContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: getSpace(Spaces.xxxLarge),
    marginHorizontal: 10,
    width: '100%',
    height: '100%',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '25%',
    paddingLeft: getSpace(Spaces.medium),
  },
  imgText: {
    textAlign: 'left',
    marginVertical: getSpace(Spaces.small),
  },
  touchable: {
    width: 350,
    height: 300,
    borderRadius: 20,
  }
});

export default HomeScreen;
