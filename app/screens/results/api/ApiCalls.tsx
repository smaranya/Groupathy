import ApiRequest from '../../../networking/ApiRequest';
import {ApiError} from '../../../networking/types';
import {IllnessQuestionairreResult} from './Models';
import {GetEndpoints} from '../../../networking/constants';

export const fetchResultDetail = (
  resultId: number,
): Promise<IllnessQuestionairreResult> => {
  return new Promise((resolve, reject) => {
    const path = `${GetEndpoints.USER_ANALYTICS}${resultId}`;
    ApiRequest(path)
      .then((result) => {
        resolve(result as IllnessQuestionairreResult);
      })
      .catch((err: ApiError) => {
        reject(err);
      });
  });
};
