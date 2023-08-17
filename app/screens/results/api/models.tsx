import {TherapistInfo} from 'app/typings/global';

export type IllnessQuestionairreResult = {
  analyticsResult: ResultData;
  psychiatristData: Array<TherapistInfo>;
};

export type ResultData = {
  score: number;
  scoreOutOf: number;
  analysis?: string;
  severity?: string;
};
