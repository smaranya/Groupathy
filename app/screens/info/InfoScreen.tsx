import {StackNavigationProp} from '@react-navigation/stack';
import {Button} from '../../components/molecules/Button';
import {Colors, getColor} from '../../styles/colors';
import {getSpace, Spaces} from '../../styles/spaces';
import React, {FunctionComponent, useCallback} from 'react';
import {Dimensions, ImageBackground, StyleSheet, View} from 'react-native';
import {FontStyles} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';
import {TextView} from '../../components/atoms/TextView';
import {RouteProp} from '@react-navigation/native';

const defaultProps = {
  buttonText: 'I Agree',
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: getSpace(Spaces.xxxLarge),
  },
  infoText: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: getSpace(Spaces.large),
    paddingTop: getSpace(Spaces.xxxLarge),
  },
  buttonStyle: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 30,
    bottom: '10%',
    paddingVertical: getSpace(Spaces.small),
    backgroundColor: getColor({color: Colors.buttonFill, opacity: 60}),
  },
  shimImage: {
    position: 'absolute',
    flex: 1,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: getColor({color: Colors.primaryColor, opacity: 10}),
  },
});

export type InfoScreenScreenProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

const InfoScreen: FunctionComponent<InfoScreenScreenProps> = (
  props: InfoScreenScreenProps,
) => {
  const {navigation, route} = props;
  const {backgroundImage, infoText, buttonText} = route.params || {};

  const onClick = useCallback(() => {
    navigation.pop(1);
  }, [navigation]);

  const {width, height} = Dimensions.get('window');
  const containerStyle = [styles.container, {width: width, height: height}];

  const buttonWidth = width - 2 * getSpace(Spaces.xLarge);

  const imageSource = backgroundImage
    ? {uri: backgroundImage}
    : require('../../assets/suicide_info.png');

  return (
    <View style={styles.topContainer}>
      <ImageBackground
        style={[containerStyle, {width: Dimensions.get('window').width}]}
        source={imageSource}>
        <TextView
          style={styles.infoText}
          fontSize={Sizes.xLarge}
          textColor={{color: Colors.white}}
          fontFamily={FontStyles.bold}>
          {infoText}
        </TextView>
        <Button
          style={[styles.buttonStyle, {width: buttonWidth}]}
          touchableProps={{
            touchable: 'highLight',
            onPress: onClick,
            disabled: false,
          }}
          textProps={{
            textColor: {color: Colors.white},
            fontFamily: FontStyles.bold,
            fontSize: Sizes.large,
          }}
          text={buttonText || defaultProps.buttonText}
        />
      </ImageBackground>
    </View>
  );
};

export default InfoScreen;
