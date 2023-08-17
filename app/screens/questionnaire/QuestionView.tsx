import React, {PureComponent, useCallback} from 'react';
import {StyleSheet, FlatList, View, Dimensions} from 'react-native';
import {QuestionsResponse, AnswerResponse, SelectedAnswer} from './api/Models';
import TextWithRadioButtonLeft from '../../components/molecules/TextWithRadioButtonLeft';
import {FontStyles} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';
import {Spaces, getSpace} from '../../styles/spaces';
import {Colors, getColor} from '../../styles/colors';
import {Button} from '../../components/molecules/Button';
import {
  SUBMIT_QUESTIONS,
  NEXT_QUESTION,
  SUICIDE_QUESTION_TEXT_PART,
} from './constants';
import {TextView} from '../../components/atoms/TextView';
import {
  //HeaderHeightContext,
  StackNavigationProp,
} from '@react-navigation/stack';

const defaultStates = {
  questionData: {} as QuestionsResponse,
  answersArray: [] as Array<AnswerViewProps>,
  buttonDisabled: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  listContainer: {
    marginBottom: '25%',
  },
  questionNumberTextStyle: {
    flex: 1,
    marginTop: getSpace(Spaces.medium),
    marginHorizontal: getSpace(Spaces.small),
    marginVertical: getSpace(Spaces.subMedium),
  },
  questionTextStyle: {
    flex: 1,
    marginHorizontal: getSpace(Spaces.small),
    marginVertical: getSpace(Spaces.subMedium),
  },
  button: {
    paddingVertical: getSpace(Spaces.small),
    paddingHorizontal: getSpace(Spaces.subMedium),
    borderRadius: 30,
    borderColor: getColor({color: Colors.buttonFill, opacity: 60}),
    backgroundColor: getColor({color: Colors.buttonFill, opacity: 60}),
    position: 'absolute',
    bottom: '5%',
    alignSelf: 'center',
  },
  disabledButton: {
    borderWidth: 2,
    borderColor: getColor({color: Colors.white}),
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 20}),
  },
  buttonText: {
    paddingVertical: getSpace(Spaces.small),
    paddingHorizontal: getSpace(Spaces.small),
  },
  listHeaderStyle: {
    marginBottom: getSpace(Spaces.xxxLarge),
  },
});

const SubmitQuestions = ({
  onSubmitQuestionairre,
  isDisabled,
}: {
  onSubmitQuestionairre: any;
  isDisabled: boolean | undefined;
}) => {
  const onClick = useCallback(() => {
    onSubmitQuestionairre && onSubmitQuestionairre();
  }, [onSubmitQuestionairre]);
  const buttonWidth = Dimensions.get('window').width - 4 * Spaces.xxLarge;
  return (
    <Button
      style={[styles.button, {width: buttonWidth}]}
      touchableProps={{
        touchable: 'highLight',
        underlayColor: 'transparent',
        onPress: onClick,
        disabled: isDisabled,
      }}
      textProps={{
        style: styles.buttonText,
        textColor: {color: Colors.white},
        fontFamily: FontStyles.bold,
        fontSize: Sizes.large,
      }}
      disabledStyle={styles.disabledButton}
      text={SUBMIT_QUESTIONS}
    />
  );
};

const NextQuestion = ({
  moveToNextQuestion,
  isDisabled,
}: {
  moveToNextQuestion: any;
  isDisabled: boolean | undefined;
}) => {
  const onClick = useCallback(() => {
    moveToNextQuestion && moveToNextQuestion();
  }, [moveToNextQuestion]);
  const buttonWidth = Dimensions.get('window').width - 4 * Spaces.xxLarge;
  return (
    <Button
      style={[styles.button, {width: buttonWidth}]}
      touchableProps={{
        touchable: 'highLight',
        underlayColor: 'transparent',
        onPress: onClick,
        disabled: isDisabled,
      }}
      textProps={{
        style: styles.buttonText,
        textColor: {color: Colors.white},
        fontFamily: FontStyles.bold,
        fontSize: Sizes.medium,
      }}
      disabledStyle={styles.disabledButton}
      text={NEXT_QUESTION}
    />
  );
};

type State = Partial<typeof defaultStates>;

export type AnswerViewProps = {
  isSelected: boolean;
} & AnswerResponse;

export type QuestionViewProps = {
  navigation: StackNavigationProp<any, any>;
  questionData: QuestionsResponse;
  key: number;
  showSubmitQuestion: boolean;
  questionNumber: string;
  onAnswerSelected?: {(answerData: SelectedAnswer): void};
  onSubmitQuestionairre?: {(): void};
  moveToNextQuestion?: {(): void};
  showSuicideCheckInfo?: {(): void};
};

const resetAnswersArray = (answersArray: Array<AnswerResponse>) => {
  const answersViewArray = [] as Array<AnswerViewProps>;
  answersArray &&
    answersArray.map((answer) => {
      answersViewArray.push({
        id: answer.id,
        data: answer.data,
        isSelected: false,
      });
    });
  return answersViewArray;
};

const updateAnswersArrayWithSelection = (
  selectedAnswerId: number,
  answersArray?: Array<AnswerViewProps>,
) => {
  return (
    answersArray &&
    answersArray.map((answer) => {
      if (answer.id === selectedAnswerId) {
        answer.isSelected = true;
      } else {
        answer.isSelected = false;
      }
      return answer;
    })
  );
};

class QuestionView extends PureComponent<QuestionViewProps, State> {
  state: Readonly<State> = defaultStates;
  answersArray: Array<any> = [];
  suicideWarningShown = false;
  currentAnswerId = -1;

  constructor(props: QuestionViewProps) {
    super(props);
    this.onOptionPress = this.onOptionPress.bind(this);
  }

  // compare state and props for setting appropriate data
  static getDerivedStateFromProps(props: QuestionViewProps, state: State) {
    if (props.questionData && props.questionData !== state.questionData) {
      return {
        ...state,
        questionData: props.questionData,
        answersArray: resetAnswersArray(props.questionData.answer),
      };
    }
    return {
      ...state,
    };
  }

  getAnswerSelectionStatus = (answerId: number): boolean => {
    const cuurentAnswer = this.state.answersArray?.find(
      (answer) => answer.id === answerId,
    );
    return cuurentAnswer?.isSelected ?? false;
  };

  onOptionPress = (xtraData: any) => {
    const {answerId} = xtraData || {};
    this.setState({
      answersArray: updateAnswersArrayWithSelection(
        answerId,
        this.state.answersArray,
      ),
    });
    this.state.questionData &&
      this.props.onAnswerSelected &&
      this.props.onAnswerSelected({
        question_id: this.state.questionData?.id,
        answer_id: answerId,
      });
    this.currentAnswerId = answerId;
    this.suicideWarningShown = false;
    this.setState({buttonDisabled: false});
    if (this.state.questionData?.data.includes(SUICIDE_QUESTION_TEXT_PART)) {
      if (
        !this.suicideWarningShown &&
        this.currentAnswerId > 0 &&
        this.currentAnswerId !== 1
      ) {
        this.suicideWarningShown = true;
        this.props.showSuicideCheckInfo && this.props.showSuicideCheckInfo();
        return;
      }
    }
  };

  renderAnswer = ({item}: {item: AnswerViewProps}) => (
    <TextWithRadioButtonLeft
      xtraData={{answerId: item.id}}
      onPress={this.onOptionPress}
      isOptionSelected={this.getAnswerSelectionStatus(item.id)}
      text={item.data}
    />
  );

  keyExtractor = (answer: AnswerViewProps) => {
    return answer.id.toString();
  };

  renderHeader = () => {
    return (
      <View style={styles.listHeaderStyle}>
        <TextView
          fontFamily={FontStyles.medium}
          fontSize={Sizes.medium}
          textColor={{color: Colors.white}}
          style={styles.questionNumberTextStyle}>
          {this.props.questionNumber}
        </TextView>
        <TextView
          fontFamily={FontStyles.bold}
          fontSize={Sizes.xLarge}
          textColor={{color: Colors.white}}
          style={styles.questionTextStyle}>
          {this.state.questionData?.data}
        </TextView>
      </View>
    );
  };

  moveToNextQuestion = () => {
    if (this.state.questionData?.data.includes(SUICIDE_QUESTION_TEXT_PART)) {
      if (
        !this.suicideWarningShown &&
        this.currentAnswerId > 0 &&
        this.currentAnswerId !== 1
      ) {
        this.suicideWarningShown = true;
        this.props.showSuicideCheckInfo && this.props.showSuicideCheckInfo();
        return;
      }
    }
    this.props.moveToNextQuestion && this.props.moveToNextQuestion();
  };

  onSubmitQuestionairre = () => {
    this.props.onSubmitQuestionairre && this.props.onSubmitQuestionairre();
  };

  renderFab = () => {
    return this.props.showSubmitQuestion ? (
      <SubmitQuestions
        isDisabled={this.state.buttonDisabled}
        onSubmitQuestionairre={this.onSubmitQuestionairre}
      />
    ) : (
      <NextQuestion
        isDisabled={this.state.buttonDisabled}
        moveToNextQuestion={this.moveToNextQuestion}
      />
    );
  };

  render() {
    const {width} = Dimensions.get('window');
    return this.state.questionData && this.state.answersArray ? (
      <View>
        
      </View>
      // <HeaderHeightContext.Consumer>
      //   {(headerHeight) => (
      //     <View
      //       style={[
      //         styles.container,
      //         {width: width, paddingTop: headerHeight && headerHeight / 10},
      //       ]}>
      //       <FlatList
      //         showsVerticalScrollIndicator={true}
      //         style={[styles.listContainer, {width: width}]}
      //         data={this.state.answersArray}
      //         keyExtractor={this.keyExtractor}
      //         ListHeaderComponent={this.renderHeader}
      //         renderItem={this.renderAnswer}
      //       />
      //       {this.renderFab()}
      //     </View>
      //   )}
      // </HeaderHeightContext.Consumer>
    ) : null;
  }
}

export default QuestionView;
