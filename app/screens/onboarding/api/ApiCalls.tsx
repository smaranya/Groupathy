import ApiRequest from '../../../networking/ApiRequest';
import {PostEndpoints} from '../../../networking/constants';
import {storeObjectData} from '../../../utils';
import {OnboardingResponse, OnboardingQuestions} from './Models';

const onboardingResponse = require('./onboardingResponse.json');

export const fetchOnBoardingQuestions = (): Promise<
  Array<OnboardingQuestions>
> => {
  return new Promise((resolve) => {
    resolve(
      convertOnboardingResponse(onboardingResponse as OnboardingResponse),
    );
  });
};

const convertOnboardingResponse = (
  onboardingQuestionsResponse: OnboardingResponse,
): Array<OnboardingQuestions> => {
  let onboardingQuestionsArray = [] as Array<OnboardingQuestions>;
  Object.keys(onboardingQuestionsResponse).forEach((key: string) => {
    const value = onboardingQuestionsResponse[key] as OnboardingQuestions;
    if (value) {
      onboardingQuestionsArray.push(value);
    }
  });
  return onboardingQuestionsArray;
};

export const saveUserData = (
  organization: string,
  pincode: string,
  retry = 0,
) => {
  return new Promise(() => {
    const path = PostEndpoints.CREATE_USER;
    ApiRequest(
      path,
      'POST',
      {organization, pincode},
      undefined,
      undefined,
      false,
    )
      .then(() => {
        return;
      })
      .catch(() => {
        // if (retry < 3) {
        //   saveUserData(organization, pincode, ++retry);
        // } else {
        //   storeObjectData('USER_DETAILS', {organization, pincode});
        // }
      });
  });
};
