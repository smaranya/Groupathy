import {TherapistInfo} from '../../typings/global';
import {ResultData} from './api/Models';

export type ResultViewModel = {
  resultData: ResultData;
  therapistData: Array<TherapistInfo>;
};

export type ListDataViewModel = {
  type: ViewModelType;
  data: any;
};

export type ViewModelType =
  | 'VIEW_TYPE_FEEDBACK'
  | 'VIEW_TYPE_MAIN_RESULT'
  | 'VIEW_TYPE_CONTACT_THERAPIST';
