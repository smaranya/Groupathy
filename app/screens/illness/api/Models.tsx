import {TherapistInfo} from '../../../typings/global';

export type IllnessSubroupsResponse = {
  groupTypeList: Array<IllnessSubgroupListResultsResponse>;
  psychiatristData: Array<TherapistInfo>;
};

export type IllnessSubgroupListResultsResponse = {
  subGroupTypeId: number;
  initialText: string;
  subGroupType?: string;
  subGroupTypeImageUrl?: string;
  lastScore?: string;
  lastScoreOutOf?: string;
  dateOfLastScore?: string;
  knowMoreUrl?: string;
};
