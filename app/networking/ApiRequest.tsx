import APIService from './ApiService';
import {ApiMethod, ApiHeader, QueryParam} from './types';
import {HTTP_CODES} from './constants';
import {getErrorData, createQueryParamsString} from './utils';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';

export const baseWebUrl = 'https://api.groupathy.com/grouptherapy';

const baseUrl = 'https://api.groupathy.com/api/';

const apiService = new APIService();
const TRANSFORM_RESPONSE = '_transform=true';

const getApiEndpoint = (
  path: string,
  queryParams?: string,
  shouldTransform?: boolean,
) => {
  let endpoint: string = `${baseUrl}${path}`;
  if (queryParams) {
    endpoint = `${endpoint}?${queryParams}`;
    endpoint = shouldTransform ? `${endpoint}&${TRANSFORM_RESPONSE}` : endpoint;
  } else {
    endpoint = shouldTransform ? `${endpoint}?${TRANSFORM_RESPONSE}` : endpoint;
  }
  return endpoint;
};

const ApiRequest = (
  path: string,
  method?: ApiMethod,
  requestBody?: any,
  headers?: ApiHeader[],
  queryParams?: Array<QueryParam>,
  transform?: boolean,
) => {
  return new Promise((resolve, reject) => {
    NetInfo.fetch()
      .then((state: NetInfoState) => {
        if (state.isConnected) {
          method = method || 'GET';
          const apiEndpoint = getApiEndpoint(
            path,
            createQueryParamsString(queryParams),
            transform || method === 'GET',
          );
          apiService.setMethod(method);
          apiService.addDefaultHeader();
          if (headers) {
            apiService.addHeaders(headers);
          }
          requestBody = requestBody || {};
          fetch(
            apiEndpoint,
            method === 'GET'
              ? apiService.get()
              : apiService.postOrPut(requestBody),
          )
            .then((response) => {
              if (response.status === HTTP_CODES.HTTP_STATUS_OK && response) {
                resolve(response.json());
              } else {
                reject(getErrorData(response.status));
              }
            })
            .catch(() => {
              reject(getErrorData(HTTP_CODES.HTTP_GENERIC_ERROR));
            });
        } else {
          reject(getErrorData(HTTP_CODES.HTTP_NO_NETWORK));
        }
      })
      .catch(() => {
        reject(getErrorData(HTTP_CODES.HTTP_NO_NETWORK));
      });
  });
};

export default ApiRequest;
