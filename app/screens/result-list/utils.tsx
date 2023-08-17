import {
  ListViewModel,
  ResultListData,
  ResultChartData,
  ResultListItem,
  ResultChartDataItem,
  ConatactTherapistViewModel,
} from './ListViewModel';
import {ResultListResponse} from './api/models';
import {
  VIEW_TYPE_CHART,
  VIEW_TYPE_RESULT_LIST,
  MAX_CHART_COUNT,
  VIEW_TYPE_CONTACT_THERAPIST,
} from './constants';
import {TherapistInfo} from '../../typings/global';

export const createViewModelData = (
  resultListResponse: ResultListResponse,
): ListViewModel => {
  const listViewModel = [] as ListViewModel;
  const resultList = [] as ResultListData;
  const chartData = [] as ResultChartData;
  let chartDataCount = 0;
  resultListResponse.analyticsResultHistory &&
    resultListResponse.analyticsResultHistory.map((result) => {
      const {date} = result;
      if (!date) {
        return;
      }
      const resultListItem = {
        dateTime: result.date,
        score: formScoreString(result.score, result.scoreOutOf),
      } as ResultListItem;
      const chartDataItem = {
        xAxisLabel: result.date,
        yAxisLabel: result.score.toString(),
        value: result.score,
      } as ResultChartDataItem;
      resultList.push(resultListItem);
      if (chartDataCount < MAX_CHART_COUNT) {
        chartData.push(chartDataItem);
        chartDataCount++;
      }
    });

  if (chartData.length > 0) {
    const actualCharData = [] as Array<any>;
    chartData.map((data, index) => {
      if (index > 3) {
        return;
      }
      actualCharData.push(data);
    });
    const actualCharDataReverse = actualCharData.reverse();
    listViewModel.push({
      type: VIEW_TYPE_CHART,
      data: actualCharDataReverse,
    });
  }

  if (resultList.length > 0) {
    listViewModel.push({
      type: VIEW_TYPE_RESULT_LIST,
      data: resultList,
    });
  }

  listViewModel.push({
    type: VIEW_TYPE_CONTACT_THERAPIST,
    data: createTherapistData(resultListResponse.psychiatristData),
  });

  return listViewModel;
};

const formScoreString = (score: number, scoreOutOf: number): string => {
  return `${score}/${scoreOutOf}`;
};

export const createTherapistData = (therapistList: Array<TherapistInfo>) => {
  const contactTherapistViewData = [] as ConatactTherapistViewModel;
  therapistList.map((therapist) => {
    contactTherapistViewData.push({
      name: therapist.name,
      imageUrl: therapist.imageUrl,
      designation: `${therapist.description}\n${therapist.experience}`,
      expertise: therapist.expertise,
      contactNumber: therapist.contactnumber,
      languages: therapist.languages,
    });
  });
  return contactTherapistViewData;
};
