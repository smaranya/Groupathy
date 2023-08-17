import ApiRequest from '../../../networking/ApiRequest';
import {ApiError} from '../../../networking/types';
import {IllnessSubroupsResponse} from './Models';
import {GetEndpoints} from '../../../networking/constants';
import {filterIllnessData} from '../utils';

export const fetchIllnessSubGroups = (): Promise<IllnessSubroupsResponse> => {
  return new Promise((resolve, reject) => {
    const path = GetEndpoints.ILLNESS_SUBGROUP;
    ApiRequest(path)
      .then((result: any) => {
        return result as IllnessSubroupsResponse;
      })
      .then((result) => resolve(filterIllnessData(result)))
      .catch((err: ApiError) => {
        reject(err);
      });
  });
};
