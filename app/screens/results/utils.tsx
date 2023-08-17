import {ListDataViewModel} from './viewModels';
import {
  GIVE_FEEDBACK_BUTTON_TEXT,
  FEEDBACK_DESCRIPTION,
  FEEDBACK_TITLE,
} from '../../assets/stringLiterals';
import {
  VIEW_TYPE_FEEDBACK,
  VIEW_TYPE_MAIN_RESULT,
  MAX_PERCENT,
  MIN_PERCENT,
  MAX_ANGLE,
  SEVERE_ILLLNESS_PERCENT,
  MILD_ILLLNESS_PERCENT,
  CRITICAL_ILLLNESS_PERCENT,
  VIEW_TYPE_CONTACT_THERAPIST,
} from './constants';
import {Colors, getColor} from '../../styles/colors';
import {createTherapistData} from '../result-list/utils';
import {IllnessQuestionairreResult, ResultData} from './api/Models';

export const getScoreFill = (maxValue: number, outOf: number): number => {
  if (maxValue === 0) {
    return MIN_PERCENT;
  }
  if (maxValue <= outOf) {
    return MAX_PERCENT;
  }
  return Math.floor((outOf / maxValue) * MAX_PERCENT);
};

export const getFillColor = (maxValue: number, outOf: number): string => {
  const fill = getScoreFill(maxValue, outOf);
  if (fill >= SEVERE_ILLLNESS_PERCENT) {
    return getColor({color: Colors.urgency});
  } else if (
    fill >= CRITICAL_ILLLNESS_PERCENT &&
    fill < SEVERE_ILLLNESS_PERCENT
  ) {
    return getColor({color: Colors.critical});
  } else if (
    fill >= MILD_ILLLNESS_PERCENT &&
    fill < CRITICAL_ILLLNESS_PERCENT
  ) {
    return getColor({color: Colors.mild});
  }
  return getColor({color: Colors.veryMild});
};

export const getArcSweepingAngle = (maxValue: number, outOf: number) => {
  const fill = getScoreFill(maxValue, outOf);
  return (MAX_ANGLE / MAX_PERCENT) * fill;
};

export const convertToListViewModel = (
  resultViewModel: IllnessQuestionairreResult,
): Array<ListDataViewModel> => {
  if (!resultViewModel) {
    return [] as Array<ListDataViewModel>;
  }
  const listViewModelArray = [] as Array<ListDataViewModel>;
  listViewModelArray.push(construsctMainView(resultViewModel.analyticsResult));
  listViewModelArray.push(construsctFeedBackView());
  listViewModelArray.push({
    type: VIEW_TYPE_CONTACT_THERAPIST,
    data: createTherapistData(resultViewModel.psychiatristData),
  });
  return listViewModelArray;
};

const construsctMainView = (resultViewModel: ResultData): ListDataViewModel => {
  return {
    type: VIEW_TYPE_MAIN_RESULT,
    data: {
      title: resultViewModel.severity,
      score: resultViewModel.score,
      analysis: resultViewModel.analysis,
      scoreOutOf: resultViewModel.scoreOutOf,
    },
  } as ListDataViewModel;
};

const construsctFeedBackView = (): ListDataViewModel => {
  return {
    type: VIEW_TYPE_FEEDBACK,
    data: {
      title: FEEDBACK_TITLE,
      description: FEEDBACK_DESCRIPTION,
      buttonText: GIVE_FEEDBACK_BUTTON_TEXT,
    },
  } as ListDataViewModel;
};
