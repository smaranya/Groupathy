import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {Colors, getColor} from '../../styles/colors';
import React, {PureComponent, useCallback} from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {OnboardingQuestions, Organization} from './api/Models';
import {fetchOnBoardingQuestions, saveUserData} from './api/ApiCalls';
import {
  GiftedChat,
  Bubble,
  BubbleProps,
  MessageText,
} from 'react-native-gifted-chat';
import {createGroupathyMessages, createUserResponseMessages} from './utils';
import {FontStyles, getName} from '../../styles/fonts/names';
import {getSize, Sizes} from '../../styles/fonts/sizes';
import {getSpace, Spaces} from '../../styles/spaces';
import {Button} from '../../components/molecules/Button';
import navigateTo from '../../navigation/navigateTo';
import {baseWebUrl} from '../../networking/ApiRequest';
import {getStringData, storeStringData} from '../../utils';
import {TextView} from '../../components/atoms/TextView';
import LinearGradient from 'react-native-linear-gradient';
import remoteConfig from '@react-native-firebase/remote-config';
import Modal from 'react-native-modal';
import UserInputCard from './UserInputModal';
//import ProgressBar from '../../components/commons/CircularProgress';
//import crashlytics from '@react-native-firebase/crashlytics';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

const groupathyAvatar = require('../../assets/avatar_groupathy.png');

const DEAFULT_MESSAGE_READING_TIME = 2000;
const NOTIFICATION_CONSENT_TYPE = 'NOTIFICATION CONSENT';
const PRIVACY_CONSENT_TYPE = 'PRIVACY CONSENT';
const PRIVACY_POLICY_PATH = '/privacy_policy/';
const ONBOARDING_STATUS = '/privacy_policy/';
const USER_ID = 10;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 5}),
  },
  giftChatContainer: {
    flex: 1,
    marginBottom: 100,
  },
  messageContainerStyle: {
    marginVertical: getSpace(Spaces.small),
  },
  messageBubbleStyle: {
    fontFamily: getName(FontStyles.medium),
    fontSize: getSize(Sizes.xxLarge),
    color: getColor({color: Colors.buttonFill}),
  },
  bottomButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: getColor({color: Colors.onboardingButton, opacity: 100}),
    paddingVertical: getSpace(Spaces.small),
    paddingHorizontal: getSpace(Spaces.small),
    marginHorizontal: getSpace(Spaces.small),
  },
  buttonContainerNegative: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: getColor({color: Colors.secondaryColor, opacity: 60}),
    paddingVertical: getSpace(Spaces.small),
    paddingHorizontal: getSpace(Spaces.small),
    marginHorizontal: getSpace(Spaces.small),
  },
  linkStyle: {
    color: 'blue',
    fontFamily: getName(FontStyles.italicMedium),
  },
  rightMessageContainer: {
    borderRadius: 30,
    backgroundColor: getColor({color: Colors.white}),
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpace(Spaces.small),
  },
  rightMessageText: {
    margin: getSpace(Spaces.xSmall),
    textAlign: 'center',
    flex: 1,
  },
  avatarContainerStyle: {
    backgroundColor: 'white',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImageStyle: {
    width: 40,
    height: 40,
  },
  modalStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const defaultStates = {
  onboardingResonse: [] as Array<OnboardingQuestions>,
  messages: [] as any,
  showBottomButtonView: false,
  answers: [] as any,
  isModalVisible: false,
  isLoading: false,
  organizations: [] as Array<Organization>,
};

export type State = Partial<typeof defaultStates>;

export type OnboardingProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

export type UserInputButtonProps = {
  buttonText: string;
  buttonWidth: number;
  typeNotificationNegative?: boolean;
  onUserInput?: {(text: string): void};
};

const UserInputButton = (props: UserInputButtonProps) => {
  const {
    buttonText,
    onUserInput,
    buttonWidth,
    typeNotificationNegative,
  } = props;
  const onClick = useCallback(() => {
    onUserInput && onUserInput(buttonText);
  }, [onUserInput, buttonText]);
  const buttonStyle = typeNotificationNegative
    ? styles.buttonContainerNegative
    : styles.buttonContainer;
  const textProps = typeNotificationNegative
    ? {
        textColor: {color: Colors.secondaryColor, opacity: 80},
        fontFamily: FontStyles.bold,
        fontSize: Sizes.large,
      }
    : {
        textColor: {color: Colors.white},
        fontFamily: FontStyles.bold,
        fontSize: Sizes.large,
      };
  return (
    <Button
      style={[buttonStyle, {width: buttonWidth}]}
      touchableProps={{
        touchable: 'highLight',
        onPress: onClick,
      }}
      textProps={textProps}
      text={buttonText}
    />
  );
};

class Onboarding extends PureComponent<OnboardingProps, State> {
  timeOutId?: any;
  currentQuestionType?: string;
  currentQuestionIndex = 0;
  onboardingResonse = [] as Array<OnboardingQuestions>;
  halfCardRef = React.createRef<Modal>();
  organizations = [] as Array<Organization>;
  constructor(props: OnboardingProps) {
    super(props);
    this.state = defaultStates;
  }

  async componentDidMount() {
    NetInfo.fetch().then((state) => {
      if (state.isConnected) {
        this.fetchAndSaveOrganizationData(state);
      }
    });

    const onBoardingStatus = await getStringData(ONBOARDING_STATUS);
    if (onBoardingStatus) {
      navigateTo({
        navigation: this.props.navigation,
        path: '/illness/groups',
        params: {},
        replace: true,
      });
    } else {
      fetchOnBoardingQuestions().then(
        (onboardingResonse: Array<OnboardingQuestions>) => {
          if (onboardingResonse) {
            this.onboardingResonse = onboardingResonse;
            this.currentQuestionIndex = 0;
            this.onTimeOut();
          }
        },
      );
    }
  }

  fetchAndSaveOrganizationData = async (state: NetInfoState) => {
    if (state.isInternetReachable) {
      await remoteConfig().ensureInitialized();
    }
    const organizations = remoteConfig().getValue('organizations');
    console.log(organizations);
    if (organizations) {
      const orgString = organizations.asString();
      if (orgString) {
        try {
          let orgData = JSON.parse(orgString);
          if (orgData) {
            this.setState({
              organizations: JSON.parse(organizations.asString()) as Array<
                Organization
              >,
            });
          }
        } catch (e) {
          // crashlytics().recordError(
            //new Error('Wrong config format for organizations'),
          //);
        }
      }
    }
  };

  componentWillUnmount() {
    this.timeOutId && clearInterval(this.timeOutId);
  }

  onTimeOut = async () => {
    if (this.currentQuestionIndex >= this.onboardingResonse.length) {
      storeStringData(ONBOARDING_STATUS, 'DONE');
      navigateTo({
        navigation: this.props.navigation,
        path: '/illness/groups',
        params: {},
        replace: true,
      });
      return;
    }

    const currentOnbroardingQuestion = this.onboardingResonse[
      this.currentQuestionIndex
    ];
    this.currentQuestionType = currentOnbroardingQuestion.type;
    if (currentOnbroardingQuestion) {
      const previousMessages = this.state.messages;
      const currentMessage = createGroupathyMessages(
        currentOnbroardingQuestion.question,
        this.currentQuestionIndex,
      );
      const newMessages = currentMessage.concat(previousMessages);
      this.setState({messages: newMessages});

      // move to next question in case no user input required
      if (
        !currentOnbroardingQuestion.answer ||
        currentOnbroardingQuestion.answer.length === 0
      ) {
        this.currentQuestionIndex++;
        this.timeOutId = setTimeout(
          this.onTimeOut,
          DEAFULT_MESSAGE_READING_TIME,
        );
      } else {
        // ask for user Input
        this.appendUserChoiceMessages(currentOnbroardingQuestion);
      }
    }
  };

  appendUserChoiceMessages = (
    currentOnbroardingQuestion: OnboardingQuestions,
  ) => {
    const answers = currentOnbroardingQuestion.answer;
    answers && this.setState({showBottomButtonView: true, answers});
  };

  renderBottomView = () => {
    if (!this.state.answers && this.state.answers.length === 0) {
      this.currentQuestionIndex++;
      this.timeOutId = setTimeout(this.onTimeOut, DEAFULT_MESSAGE_READING_TIME);
      this.setState({showBottomButtonView: false, answers: []});
      return;
    }
    const {width} = Dimensions.get('window');
    const buttonWidth =
      width / this.state.answers.length - getSpace(Spaces.large);

    if (
      this.currentQuestionType &&
      this.currentQuestionType === PRIVACY_CONSENT_TYPE
    ) {
      return (
        <View style={styles.bottomButtonContainer}>
          <UserInputButton
            buttonText={this.state.answers[0]}
            buttonWidth={buttonWidth}
            onUserInput={this.onPrivacyAccept}
          />
        </View>
      );
    }
    if (this.state.answers.length === 1) {
      return (
        <View style={styles.bottomButtonContainer}>
          <UserInputButton
            buttonText={this.state.answers[0]}
            buttonWidth={buttonWidth}
            onUserInput={this.onUserAcceptance}
          />
        </View>
      );
    }
    return (
      <View style={styles.bottomButtonContainer}>
        {this.state.answers &&
          this.state.answers.map((answer: any, index: number) => {
            return (
              <UserInputButton
                buttonText={answer}
                buttonWidth={buttonWidth}
                onUserInput={
                  this.currentQuestionType &&
                  this.currentQuestionType === NOTIFICATION_CONSENT_TYPE
                    ? index === 0
                      ? this.onNotificationDecline
                      : this.onNotificationConsent
                    : this.onUserAcceptance
                }
                typeNotificationNegative={
                  this.currentQuestionType === NOTIFICATION_CONSENT_TYPE &&
                  index === 0
                }
              />
            );
          })}
      </View>
    );
  };

  onPrivacyAccept = (userInput: string) => {
    this.showPersonalizationInfoScreen();
    this.onUserAcceptance(userInput);
  };

  onUserAcceptance = (userInput: string) => {
    this.currentQuestionType = '';
    this.currentQuestionIndex++;
    this.setState({showBottomButtonView: false, answers: []}, () => {
      const previousMessages = this.state.messages;
      const currentMessage = createUserResponseMessages(userInput);
      const newMessages = currentMessage.concat(previousMessages);
      this.setState({messages: newMessages}, () => {
        GiftedChat.append(currentMessage, previousMessages);
        this.onTimeOut();
      });
    });
  };

  onNotificationDecline = (userInput: string) => {
    this.currentQuestionType = '';
    this.currentQuestionIndex++;
    this.setState({showBottomButtonView: false, answers: []}, () => {
      const previousMessages = this.state.messages;
      const currentMessage = createUserResponseMessages(userInput);
      const newMessages = currentMessage.concat(previousMessages);
      this.setState({messages: newMessages}, () => {
        GiftedChat.append(currentMessage, previousMessages);
        this.onTimeOut();
      });
    });
    storeStringData('isNotificationConsetGiven', 'no');
  };

  onNotificationConsent = (userInput: string) => {
    // send appropriate response
    this.currentQuestionType = '';
    this.currentQuestionIndex++;
    this.setState({showBottomButtonView: false, answers: []}, () => {
      const previousMessages = this.state.messages;
      const currentMessage = createUserResponseMessages(userInput);
      const newMessages = currentMessage.concat(previousMessages);
      this.setState({messages: newMessages}, () => {
        GiftedChat.append(currentMessage, previousMessages);
        this.onTimeOut();
      });
    });
    this.getToken();
  };

  showPersonalizationInfoScreen = () => {
    this.setState({isModalVisible: true});
  };

  //TODO Add FCM logic later
  getToken = async () => {
    storeStringData('isNotificationConsetGiven', 'yes');
  };

  renderUserResponseMessage = (text: string) => {
    return (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[
          getColor({color: Colors.leftGradient}),
          getColor({color: Colors.rightGradient}),
        ]}
        style={styles.rightMessageContainer}>
        <TextView
          style={styles.rightMessageText}
          fontFamily={FontStyles.medium}
          fontSize={Sizes.large}
          textColor={{color: Colors.white}}>
          {text}
        </TextView>
      </LinearGradient>
    );
  };

  renderMessageBubble = (props: BubbleProps<any>) => {
    const {currentMessage: {user, text} = {}} = props;
    if (user && user._id === USER_ID) {
      return this.renderUserResponseMessage(text);
    }
    return (
      <Bubble
        {...props}
        onLongPress={() => {}}
        containerStyle={{
          left: {
            padding: getSpace(Spaces.small),
          },
          right: {
            padding: getSpace(Spaces.small),
          },
        }}
        renderMessageText={this.renderMessageText}
      />
    );
  };

  renderMessageText = (props: any) => {
    return (
      <MessageText
        {...props}
        textStyle={{
          left: {
            fontFamily: getName(FontStyles.medium),
            fontSize: getSize(Sizes.large),
            color: getColor({color: Colors.secondaryColor, opacity: 80}),
          },
          right: {
            fontFamily: getName(FontStyles.medium),
            color: getColor({color: Colors.white}),
          },
        }}
      />
    );
  };

  onSaveUserData = async (organization: string, pincode: string) => {
    this.setState({isModalVisible: false});
    saveUserData(organization, pincode);
  };

  onPressPrivacyPolicy = () => {
    navigateTo({
      navigation: this.props.navigation,
      path: '/webview',
      params: {
        url: `${baseWebUrl}${PRIVACY_POLICY_PATH}`,
        headerTitle: 'Privacy Policy',
      },
    });
  };

  renderAvatar = () => {
    return (
      <View style={styles.avatarContainerStyle}>
        <Image style={styles.avatarImageStyle} source={groupathyAvatar} />
      </View>
    );
  };

  onInputCardClose = () => {
    this.setState({isModalVisible: false});
    this.halfCardRef && this.halfCardRef.current?.close();
  };

  onHalfCardDispayed = () => {
    this.setState({isLoading: false});
  };

  render() {
    return (
      <View style={[styles.container]}>
        {this.state.isLoading ? (
          <View style={styles.progressBar}>
            {/* <ProgressBar /> */}
          </View>
        ) : (
          <View style={styles.giftChatContainer}>
            <GiftedChat
              parsePatterns={(linkStyle: any) => [
                {
                  pattern: /Privacy|Policy/,
                  style: {...linkStyle, ...styles.linkStyle},
                  onPress: this.onPressPrivacyPolicy,
                },
              ]}
              showUserAvatar={false}
              showAvatarForEveryMessage={true}
              messages={this.state.messages}
              messagesContainerStyle={styles.messageContainerStyle}
              bottomOffset={20}
              renderDay={() => {
                return null;
              }}
              renderTime={() => {
                return null;
              }}
              renderInputToolbar={() => {
                return null;
              }}
              renderAvatarOnTop={true}
              minInputToolbarHeight={0}
              renderBubble={this.renderMessageBubble}
              renderAvatar={this.renderAvatar}
              user={{
                _id: 10,
              }}
            />
          </View>
        )}
        {this.state.showBottomButtonView && !this.state.isLoading
          ? this.renderBottomView()
          : null}

        <Modal
          ref={this.halfCardRef}
          style={styles.modalStyle}
          animationIn={'fadeIn'}
          animationInTiming={100}
          isVisible={this.state.isModalVisible}>
          <UserInputCard
            onClose={this.onInputCardClose}
            organizations={this.state.organizations}
            onSaveUserData={this.onSaveUserData}
            onVisible={this.onHalfCardDispayed}
          />
        </Modal>
      </View>
    );
  }
}

export default Onboarding;