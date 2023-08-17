import React, {PureComponent} from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  ViewStyle,
} from 'react-native';
import {getColor, Colors} from '../../styles/colors';
import {getSpace, Spaces} from '../../styles/spaces';
import {Button} from '../../components/molecules/Button';
import {
  KNOW_MORE_BUTTON_TEXT,
  SEE_HISTORY_BUTTON_TEXT,
  TAKE_TEST_BUTTON_TEXT,
} from '../../assets/stringLiterals';
import {FontStyles} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';
import handlePress, {PressType} from './handlePress';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {TextView} from '../../components/atoms/TextView';
import {capitalizeFirstLetter} from '../../utils';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Icon} from '../../components/atoms/Icon';
import {IconSizes} from '../../styles/iconSizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '40%',
    marginTop: getSpace(Spaces.xxxLarge),
    alignContent: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: getSpace(Spaces.subMedium),
    paddingHorizontal: getSpace(Spaces.subMedium),
    borderRadius: 30,
    borderColor: getColor({color: Colors.buttonFill, opacity: 60}),
    backgroundColor: getColor({color: Colors.buttonFill, opacity: 60}),
    marginVertical: getSpace(Spaces.largePlus),
    marginHorizontal: getSpace(Spaces.xLarge),
  },
  knowMorewButton: {
    paddingVertical: getSpace(Spaces.subMedium),
    paddingHorizontal: getSpace(Spaces.subMedium),
    borderRadius: 30,
    borderColor: getColor({color: Colors.secondaryColor, opacity: 20}),
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 20}),
    marginVertical: getSpace(Spaces.largePlus),
    marginHorizontal: getSpace(Spaces.xLarge),
  },
  buttonText: {
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 20}),
  },
  initialTextStyle: {
    textAlign: 'center',
    marginHorizontal: getSpace(Spaces.xxxLarge),
    marginTop: getSpace(Spaces.xxxLarge),
  },
  shimImage: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: getColor({color: Colors.primaryColor, opacity: 5}),
  },
  initialTextContainerStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonContainerView: {
    flex: 1,
  },
  headerBack: {
    padding: getSpace(Spaces.small),
    justifyContent: 'center',
  },
});

export type IllnessDetailScreenProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

class IllnessDetail extends PureComponent<IllnessDetailScreenProps> {
  sessionId: string = '';

  componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableHighlight
          style={styles.headerBack}
          underlayColor={'transparent'}
          onPress={this.onHomePress}>
          <Icon
            iconName={'home'}
            iconSize={IconSizes.medium}
            iconMargin={Spaces.xSmall}
            iconColor={{color: Colors.white}}
          />
        </TouchableHighlight>
      ),
    });
  }

  onShowHistoryPress = () => {
    const pressData = {
      navigation: this.props.navigation,
      path: '/group/result-list',
      extraData: {
        groupId: this.props.route.params?.groupId,
        groupSubType: this.props.route.params?.groupSubType,
        transparentHeader: 'true',
        headerTitle: 'Analysis History',
      },
    };
    handlePress({
      action: PressType.NAVIGATE,
      data: pressData,
    });
  };

  onTakeTestPress = () => {
    const titleSuffix = capitalizeFirstLetter(
      this.props.route.params?.groupSubType,
    );
    const pressData = {
      navigation: this.props.navigation,
      path: '/questionnaire/groups',
      extraData: {
        groupId: this.props.route.params?.groupId,
        headerTitle: `${titleSuffix} Test`,
        transparentHeader: true,
      },
    };
    handlePress({
      action: PressType.NAVIGATE,
      data: pressData,
    });
  };

  onKnowMorePress = () => {
    let url = this.props.route.params?.knowMoreUrl;
    if (!url) {
      return;
    }
    var prefix = 'http://';
    if (url.substr(0, prefix.length) !== prefix) {
      url = `${prefix}${url}`;
    }
    const titleSuffix = capitalizeFirstLetter(
      this.props.route.params?.groupSubType,
    );
    const pressData = {
      navigation: this.props.navigation,
      path: '/webview',
      extraData: {
        url: url,
        headerTitle: `About ${titleSuffix}`,
      },
    };
    handlePress({
      action: PressType.NAVIGATE,
      data: pressData,
    });
  };

  onHomePress = () => {
    this.props.navigation && this.props.navigation.popToTop();
  };

  renderButtons = () => {
    const buttonWidth =
      Dimensions.get('window').width - 2 * getSpace(Spaces.xxLarge);
    return (
      <View style={styles.buttonContainer}>
        <Button
          style={[styles.button, {width: buttonWidth}]}
          touchableProps={{
            touchable: 'highLight',
            disabled: false,
            onPress: this.onTakeTestPress,
          }}
          textProps={{
            style: styles.buttonText,
            textColor: {color: Colors.white},
            fontFamily: FontStyles.bold,
            fontSize: Sizes.large,
          }}
          text={TAKE_TEST_BUTTON_TEXT}
        />
        <Button
          style={[styles.button, {width: buttonWidth}]}
          touchableProps={{
            touchable: 'highLight',
            disabled: false,
            onPress: this.onShowHistoryPress,
          }}
          textProps={{
            style: styles.buttonText,
            textColor: {color: Colors.white},
            fontFamily: FontStyles.bold,
            fontSize: Sizes.largeMedPlus,
          }}
          text={SEE_HISTORY_BUTTON_TEXT}
        />
        <Button
          style={[styles.knowMorewButton, {width: buttonWidth}]}
          touchableProps={{
            touchable: 'highLight',
            disabled: false,
            onPress: this.onKnowMorePress,
          }}
          textProps={{
            style: styles.buttonText,
            textColor: {color: Colors.white},
            fontFamily: FontStyles.bold,
            fontSize: Sizes.largeMedPlus,
          }}
          text={KNOW_MORE_BUTTON_TEXT}
        />
      </View>
    );
  };

  render() {
    const {height, width} = Dimensions.get('window');
    const containerDimStyle: ViewStyle = {height: height, width: width};
    return (
      <ImageBackground
        style={[styles.container, containerDimStyle]}
        source={require('../../assets/take_test.png')}>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <TextView
            style={styles.initialTextStyle}
            textColor={{color: Colors.white}}
            fontSize={Sizes.xLarge}
            fontFamily={FontStyles.bold}>
            {this.props.route.params?.initialText}
          </TextView>
        </View>
        <View style={styles.buttonContainerView}>{this.renderButtons()}</View>
      </ImageBackground>
    );
  }
}

export default IllnessDetail;
