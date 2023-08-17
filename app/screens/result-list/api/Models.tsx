import {TherapistInfo} from '../../../typings/global';

export type ResultListResponse = {
  analyticsResultHistory: Array<ResultListResponseItem>;
  psychiatristData: Array<TherapistInfo>;
};

export type ResultListResponseItem = {
  score: number;
  scoreOutOf: number;
  analysis: string;
  date: string;
};
