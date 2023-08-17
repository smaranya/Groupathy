import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {QuestionsResponse, SelectedAnswer} from './api/Models';
import ViewPager from '@react-native-community/viewpager';
import QuestionView from './QuestionView';
import {StackNavigationProp} from '@react-navigation/stack';
import handlePress from './handlePress';
import {PressType} from './constants';
import {PressData, PressProps} from '../../typings/global';
import {HEADER_HEIGHT} from '../../navigation/headerOptions';
import {getSpace, Spaces} from '../../styles/spaces';

const defaultStates = {
  questionData: [] as Array<QuestionsResponse>,
  selectedAnswerArray: [] as Array<number>,
  suicideTnc: '' as string,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: HEADER_HEIGHT + getSpace(Spaces.largePlus),
  },
  questionContainer: {
    flex: 1,
  },
});

type State = Partial<typeof defaultStates>;
export type QuestionPagerProps = {
  navigation: StackNavigationProp<any, any>;
  questionData: Array<QuestionsResponse>;
  suicideTnc: string;
  onSubmitQuestionairreResult?: {(requestData: Array<SelectedAnswer>): void};
};

class QuestionPager extends PureComponent<QuestionPagerProps, State> {
  state: Readonly<State> = defaultStates;
  answersArray: Array<any> = [];
  viewPager: ViewPager | null = null;
  selectedAnswerMap: Map<number, SelectedAnswer> = new Map();
  currentPage: number = 0;

  constructor(props: QuestionPagerProps) {
    super(props);
    this.state = {
      questionData: [],
      selectedAnswerArray: [],
    };
    this.renderQuestions = this.renderQuestions.bind(this);
  }

  // compare state and props for setting appropriate data
  static getDerivedStateFromProps(props: QuestionPagerProps, state: State) {
    if (
      props.questionData &&
      props.questionData.length > 0 &&
      props.questionData.length !== state.questionData?.length
    ) {
      return {
        ...state,
        questionData: props.questionData,
      };
    }
    return {
      ...state,
      questionData: [],
    };
  }

  renderQuestions(questionData: QuestionsResponse, index: number) {
    return (
      <View style={styles.questionContainer}>
        <QuestionView
          navigation={this.props.navigation}
          questionData={questionData}
          key={questionData.id}
          onAnswerSelected={this.onAnswerSelected}
          showSubmitQuestion={index + 1 === this.state.questionData?.length}
          questionNumber={`Question ${index + 1} of ${
            this.state.questionData?.length
          }`}
          onSubmitQuestionairre={this.onSubmitQuestionairre}
          moveToNextQuestion={this.moveToNextQuestion}
          showSuicideCheckInfo={this.showSuicideCheckInfo}
        />
      </View>
    );
  }

  onAnswerSelected = (selectedAnswer: SelectedAnswer) => {
    this.selectedAnswerMap.set(selectedAnswer.question_id, selectedAnswer);
  };

  moveToNextQuestion = () => {
    this.currentPage++;
    this.viewPager && this.viewPager.setPage(this.currentPage);
  };

  onSubmitQuestionairre = () => {
    const answerResponseArray = [] as Array<SelectedAnswer>;
    this.selectedAnswerMap.forEach((value) => {
      answerResponseArray.push({
        question_id: value.question_id,
        answer_id: value.answer_id,
      });
    });
    this.props.onSubmitQuestionairreResult &&
      this.props.onSubmitQuestionairreResult(answerResponseArray);
  };

  isQuestionAnswered = (questionId: number) => {
    return !this.selectedAnswerMap.has(questionId);
  };

  canGoBack = () => {
    if (this.currentPage === 0) {
      return false;
    }
    if (this.state.questionData) {
      return this.currentPage < this.state.questionData.length;
    }
    return false;
  };

  goBack = () => {
    this.currentPage--;
    this.viewPager && this.viewPager.setPage(this.currentPage);
  };

  showSuicideCheckInfo = () => {
    handlePress({
      action: PressType.NAVIGATE,
      data: {
        navigation: this.props.navigation,
        path: '/info',
        extraData: {
          infoText: this.props.suicideTnc,
          buttonText: 'I Understand',
        },
      } as PressData,
    } as PressProps);
  };

  componentWillUnmount() {
    this.selectedAnswerMap.clear();
  }

  render() {
    return (
      <ViewPager
        ref={(viewpager) => {
          this.viewPager = viewpager;
        }}
        style={styles.container}
        initialPage={0}
        scrollEnabled={false}
        showPageIndicator={false}>
        {this.state.questionData?.map((questionData, index) =>
          this.renderQuestions(questionData, index),
        )}
      </ViewPager>
    );
  }
}

export default QuestionPager;
