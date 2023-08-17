import {GetEndpoints, QueryParams} from '../../../networking/constants';
import {QueryParam, ApiError} from '../../../networking/types';
import ApiRequest from '../../../networking/ApiRequest';
import {ResultListResponse} from './models';

export const fetchGroupAnalytics = (
  groupId: string,
): Promise<ResultListResponse> => {
  return new Promise((resolve, reject) => {
    const path = GetEndpoints.USER_ANALYTICS;
    const queryParams = [
      {
        name: QueryParams.SUBGRUP_GROUP_TYPE_ID,
        value: groupId,
      } as QueryParam,
    ] as Array<QueryParam>;
    ApiRequest(path, 'GET', undefined, undefined, queryParams)
      .then((result) => {
        resolve(result as ResultListResponse);
      })
      .catch((err: ApiError) => {
        reject(err);
      });
  });
};
