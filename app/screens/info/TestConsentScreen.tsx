import {StackNavigationProp} from '@react-navigation/stack';
import {Button} from '../../components/molecules/Button';
import {Colors, getColor} from '../../styles/colors';
import {getSpace, Spaces} from '../../styles/spaces';
import React, {FunctionComponent, useCallback} from 'react';
import {
  BackHandler,
  DeviceEventEmitter,
  Dimensions,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {FontStyles} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';
import {TextView} from '../../components/atoms/TextView';
import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Icon} from '../../components/atoms/Icon';
import {IconSizes} from '../../styles/iconSizes';

const defaultProps = {
  buttonText: 'I Agree',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: getSpace(Spaces.xxxLarge),
  },
  infoText: {
    flex: 1,
    textAlign: 'left',
    marginHorizontal: getSpace(Spaces.large),
    marginTop: getSpace(Spaces.xxxLarge),
  },
  buttonStyle: {
    position: 'absolute',
    alignSelf: 'center',
    borderRadius: 30,
    bottom: '10%',
    paddingVertical: getSpace(Spaces.small),
    backgroundColor: getColor({color: Colors.buttonFill, opacity: 60}),
  },
  headerBack: {
    padding: getSpace(Spaces.small),
    justifyContent: 'center',
  },
});

export type TestConsentScreenProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

const TestConsentScreen: FunctionComponent<TestConsentScreenProps> = (
  props: TestConsentScreenProps,
) => {
  const {navigation, route} = props;
  const {backgroundImage, infoText, buttonText, eventData} = route.params || {};

  const onClick = useCallback(() => {
    if (eventData && eventData.eventName) {
      DeviceEventEmitter.emit(eventData.eventName);
    }
    navigation.pop(1);
  }, [navigation, eventData]);

  //const headerHeight = useHeaderHeight();
  const {width, height} = Dimensions.get('window');
  const containerStyle = [
    styles.container,
    {
      width: width,
      height: height,
      //paddingTop: headerHeight,
    },
  ];

  const buttonWidth = width - 2 * getSpace(Spaces.xLarge);

  const imageSource = backgroundImage
    ? {uri: backgroundImage}
    : require('../../assets/appGradient.png');

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.pop(2);
        return true;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation]),
  );

  const onBackPress = useCallback(() => {
    navigation.pop(2);
  }, [navigation]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <TouchableHighlight
            style={styles.headerBack}
            underlayColor={'transparent'}
            onPress={onBackPress}>
            <Icon
              iconName={'arrow-back'}
              iconSize={IconSizes.medium}
              iconMargin={Spaces.xSmall}
              iconColor={{color: Colors.white}}
            />
          </TouchableHighlight>
        );
      },
    });
  }, [navigation, onBackPress]);

  return (
    <ImageBackground style={containerStyle} source={imageSource}>
      <TextView
        style={styles.infoText}
        fontSize={Sizes.large}
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
  );
};

export default TestConsentScreen;
