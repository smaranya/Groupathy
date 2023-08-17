import ApiRequest from '../../../networking/ApiRequest';
import {ApiError, QueryParam} from '../../../networking/types';
import {
  GroupQuestionairreResponse,
  QuestionairreResultResquest,
} from './Models';
import {
  GetEndpoints,
  QueryParams,
  PostEndpoints,
} from '../../../networking/constants';
import {IllnessQuestionairreResult} from '../../results/api/Models';

export const fetchGroupQuestionnaire = (
  groupId: string,
): Promise<GroupQuestionairreResponse> => {
  return new Promise((resolve, reject) => {
    const path = GetEndpoints.GROUP_QUESTIONNAIRE;
    const queryParams = [
      {
        name: QueryParams.SUBGRUP_GROUP_TYPE_ID,
        value: groupId,
      } as QueryParam,
    ] as Array<QueryParam>;
    ApiRequest(path, 'GET', undefined, undefined, queryParams)
      .then((result) => {
        return resolve(result as GroupQuestionairreResponse);
      })
      .catch((err: ApiError) => {
        reject(err);
      });
  });
};

export const submitGroupQuestionnaireResponse = (
  questionairreResultResquest: QuestionairreResultResquest,
): Promise<IllnessQuestionairreResult> => {
  return new Promise((resolve, reject) => {
    const path = PostEndpoints.GROUP_QUESTIONNAIRE_RESULT;
    ApiRequest(
      path,
      'POST',
      questionairreResultResquest,
      undefined,
      undefined,
      true,
    )
      .then((result) => {
        resolve(result as IllnessQuestionairreResult);
      })
      .catch((err: ApiError) => {
        reject(err);
      });
  });
};

export const getSuicideTnc = (): Promise<any> => {
  const path = GetEndpoints.SUICIDE_CHECK;
  return new Promise((resolve, reject) => {
    ApiRequest(path)
      .then((result) => {
        return resolve(result);
      })
      .catch((err: ApiError) => {
        reject(err);
      });
  });
};
