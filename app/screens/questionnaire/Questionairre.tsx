import React, {PureComponent} from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  ViewStyle,
  DeviceEventEmitter,
  EventSubscription,
  BackHandler,
  Platform,
  View,
} from 'react-native';
import {
  fetchGroupQuestionnaire,
  submitGroupQuestionnaireResponse,
} from './api/ApiCalls';
import {
  QuestionsResponse,
  SelectedAnswer,
  QuestionairreResultResquest,
} from './api/Models';
import QuestionPager from './QuestionPager';
import handlePress from './handlePress';
import {PressType} from './constants';
import {PressData, PressProps} from '../../typings/global';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {ON_NEW_TEST_TAKEN, ON_TEST_CONSENT} from '../../EventName';
import {ApiError} from '../../networking/types';
import {HTTP_CODES} from '../../networking/constants';
import Snackbar from 'react-native-snackbar';
import {FontStyles, getName} from '../../styles/fonts/names';
import {getColor, Colors} from '../../styles/colors';
import {SUICIDE_TNC} from '../../assets/stringLiterals';
import {getSpace, Spaces} from '../../styles/spaces';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Icon} from '../../components/atoms/Icon';
import {IconSizes} from '../../styles/iconSizes';
//import ProgressBar from '../../components/commons/CircularProgress';

const defaultStates = {
  questionData: [] as Array<QuestionsResponse>,
  isConsentGiven: false,
  isLoading: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBack: {
    padding: getSpace(Spaces.small),
    justifyContent: 'center',
  },
  progressBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type State = Partial<typeof defaultStates>;

export type QuestionairreScreenProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

export class Questionairre extends PureComponent<
  QuestionairreScreenProps,
  State
> {
  sessionId: string = '';
  originalHeader: string = '';
  tnc: string = '';
  consentAsked: boolean = false;
  testContentListener?: EventSubscription;
  selectedAnswers = [] as Array<SelectedAnswer>;
  questionPagerRef = React.createRef<QuestionPager>();
  focus?: any;
  blur?: any;

  constructor(props: QuestionairreScreenProps) {
    super(props);
    this.state = defaultStates;
    this.getQuestionairreResult = this.getQuestionairreResult.bind(this);
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      this.focus = this.props.navigation.addListener('focus', () => {
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.handleHardwareBackPress,
        );
      });
      this.blur = this.props.navigation.addListener('blur', () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleHardwareBackPress,
        ),
      );
    }

    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableHighlight
          style={styles.headerBack}
          underlayColor={'transparent'}
          onPress={this.onBackPress}>
          <Icon
            iconName={'arrow-back'}
            iconSize={IconSizes.medium}
            iconMargin={Spaces.xSmall}
            iconColor={{color: Colors.white}}
          />
        </TouchableHighlight>
      ),
    });
    this.testContentListener = DeviceEventEmitter.addListener(
      ON_TEST_CONSENT,
      this.onTestConsent,
    );
    this.fetchQuestionnaire();
  }

  handleHardwareBackPress = () => {
    this.onBackPress();
    return true;
  };

  onBackPress = () => {
    if (this.questionPagerRef && this.questionPagerRef.current?.canGoBack()) {
      this.questionPagerRef.current?.goBack();
    } else {
      this.props.navigation && this.props.navigation.goBack();
    }
  };

  fetchQuestionnaire = () => {
    fetchGroupQuestionnaire(this.props.route.params?.groupId)
      .then((data) => {
        if (data && data.questions && data.questions.length > 0) {
          this.sessionId = data.sessionId;
          handlePress({
            action: PressType.NAVIGATE,
            data: {
              navigation: this.props.navigation,
              path: '/test/consent',
              extraData: {
                infoText: data.tnc,
                buttonText: 'I Agree',
                headerTitle: 'Before You Begin',
                transparentHeader: true,
                eventData: {
                  eventName: ON_TEST_CONSENT,
                },
              },
            } as PressData,
          } as PressProps);
          this.setState({
            questionData: data.questions,
          });
          this.consentAsked = true;
        }
      })
      .catch((error: ApiError) => {
        switch (error.statusCode) {
          case HTTP_CODES.HTTP_NO_NETWORK:
          default:
            Snackbar.show({
              text: error.description,
              fontFamily: getName(FontStyles.medium),
              textColor: getColor({color: Colors.white}),
              backgroundColor: getColor({
                color: Colors.secondaryColor,
                opacity: 60,
              }),
              duration: Snackbar.LENGTH_INDEFINITE,
              action: {
                text: 'RETRY',
                textColor: getColor({color: Colors.buttonFill}),
                onPress: () => {
                  this.fetchQuestionnaire();
                },
              },
            });
        }
      });
  };

  async getQuestionairreResult(
    questionairreResultResquest: QuestionairreResultResquest,
  ) {
    this.setState({isLoading: true});
    submitGroupQuestionnaireResponse(questionairreResultResquest)
      .then((result) => {
        this.setState({isLoading: false});
        DeviceEventEmitter.emit(ON_NEW_TEST_TAKEN);
        handlePress({
          action: PressType.REPLACE,
          data: {
            navigation: this.props.navigation,
            path: '/questionnaire/result',
            extraData: {
              resultData: result,
              transparentHeader: true,
              groupId: this.props.route.params?.groupId,
            },
          } as PressData,
        } as PressProps);
      })
      .catch((error: ApiError) => {
        this.setState({isLoading: false});
        if (error && error.description) {
          Snackbar.show({
            text: error.description,
            fontFamily: getName(FontStyles.medium),
            textColor: getColor({color: Colors.white}),
            backgroundColor: getColor({
              color: Colors.secondaryColor,
              opacity: 60,
            }),
            duration: Snackbar.LENGTH_INDEFINITE,
            action: {
              text: 'RETRY',
              textColor: getColor({color: Colors.buttonFill}),
              onPress: () => {
                this.onSubmitQuestionairre(this.selectedAnswers);
              },
            },
          });
        }
      });
  }

  onSubmitQuestionairre = (selectedAnswers: Array<SelectedAnswer>) => {
    if (this.sessionId && this.props.route.params?.groupId) {
      this.selectedAnswers = selectedAnswers;
      const questionairreRequest = {
        session_id: this.sessionId,
        group_sub_type_id: this.props.route.params?.groupId,
        result: selectedAnswers,
      } as QuestionairreResultResquest;
      this.getQuestionairreResult(questionairreRequest);
    }
  };

  renderQuestionPager = () => {
    if (this.state.questionData && this.state.questionData.length > 0) {
      return (
        <QuestionPager
          ref={this.questionPagerRef}
          questionData={this.state.questionData}
          navigation={this.props.navigation}
          onSubmitQuestionairreResult={this.onSubmitQuestionairre}
          suicideTnc={SUICIDE_TNC}
        />
      );
    }
  };

  componentWillUnmount() {
    this.testContentListener && this.testContentListener.remove();
    this.focus && this.focus();
    this.blur && this.blur();
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleHardwareBackPress,
    );
  }

  onTestConsent = () => {
    this.setState({isConsentGiven: true});
    this.testContentListener && this.testContentListener.remove();
  };

  renderProgressBar = () => {
    return (
      <View style={styles.progressBar}>
        {/* <ProgressBar /> */}
      </View>
    );
  };

  render() {
    const {height, width} = Dimensions.get('window');
    const containerDimStyle: ViewStyle = {height: height, width: width};
    return this.state.isLoading ? (
      <ImageBackground
        style={[styles.container, containerDimStyle]}
        source={require('../../assets/appGradient.png')}>
        {this.renderProgressBar()}
      </ImageBackground>
    ) : this.state.questionData && this.state.isConsentGiven ? (
      <ImageBackground
        style={[styles.container, containerDimStyle]}
        source={require('../../assets/appGradient.png')}>
        {this.renderQuestionPager()}
      </ImageBackground>
    ) : (
      <ImageBackground
        style={[styles.container, containerDimStyle]}
        source={require('../../assets/appGradient.png')}
      />
    );
  }
}

export default Questionairre;
