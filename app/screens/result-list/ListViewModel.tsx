import {TherapistData} from '../../components/molecules/ContactTherapist';

export type ListViewModel = Array<ListViewModelItem>;

export type ListViewModelItem = {
  type: string;
  data: any;
};

export type ListViewModelItemType =
  | 'VIEW_TYPE_CHART'
  | 'VIEW_TYPE_RESULT_LIST'
  | 'VIEW_TYPE_CONTACT_THERAPIST';

export type ResultChartData = Array<ResultChartDataItem>;

export type ResultChartDataItem = {
  yAxisLabel: string;
  xAxisLabel: string;
  value: number;
};

export type ResultListData = Array<ResultListItem>;

export type ResultListItem = {
  dateTime: string;
  score: string;
};

export type ConatactTherapistViewModel = Array<TherapistData>;
