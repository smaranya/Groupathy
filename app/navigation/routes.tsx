import {ComponentClass, FunctionComponent} from 'react';
import RouteName from './RouteName';
import {pathToRegexp} from 'path-to-regexp';
import Questionairre from '../screens/questionnaire/Questionairre';
import IllnessGroups from '../screens/illness/IllnessGroups';
import ResultView from '../screens/results/ResultView';
import ResultListView from '../screens/result-list/ResultListView';
//import AppWebView from '../screens/webview/WebView';
import IllnessDetail from '../screens/illnessDetail';
import Onboarding from '../screens/onboarding/Onboarding';
import TestConsentScreen from '../screens/info/TestConsentScreen';
import InfoScreen from '../screens/info/InfoScreen';

export type Route = {
  name: string;
  regexs: Array<{
    regex: any;
    keys: Array<string>;
  }>;
  screen: ComponentClass<any, any> | FunctionComponent<any>;
  params?: Object;
  options?: any;
};

export type AppRoutes = Array<Route>;

export const processRoutes = (
  routes: Array<{
    name: string;
    regexs: Array<string>;
    screen: any;
    params?: Object;
  }>,
) =>
  routes.map(({regexs = [], ...rest}) => ({
    regexs: regexs.map((regex) => {
      const keys: any = [];
      return {
        regex: pathToRegexp(regex, keys),
        keys,
      };
    }),
    ...rest,
  }));

const appRoutes = [
  {
    name: RouteName.ILLNESS_GROUP,
    regexs: ['/illness/groups'],
    screen: IllnessGroups,
  },
  {
    name: RouteName.HOME,
    regexs: ['/illness/groups'],
    screen: IllnessGroups,
  },
  {
    name: RouteName.ILLNESS_DETAIL,
    regexs: ['/illness/detail'],
    screen: IllnessDetail,
    options: {headerTransparent: true},
  },
  {
    name: RouteName.QUESTIONNAIRE_SCREEN,
    regexs: ['/questionnaire/groups'],
    screen: Questionairre,
    options: {headerTransparent: true},
  },
  {
    name: RouteName.RESULT_DETAIL,
    regexs: ['/questionnaire/result'],
    screen: ResultView,
    options: {headerTransparent: true},
  },
  {
    name: RouteName.RESULT_LIST,
    regexs: ['/group/result-list'],
    screen: ResultListView,
    options: {headerTransparent: true},
  },
  // {
  //   name: RouteName.WEBVIEW,
  //   regexs: ['/webview'],
  //   screen: AppWebView,
  //   options: {headerShown: false},
  // },
  {
    name: RouteName.ONBOARDING,
    regexs: ['/onboarding'],
    screen: Onboarding,
    options: {headerShown: false},
  },
  {
    name: RouteName.TEST_CONSENT_SCREEN,
    regexs: ['/test/consent'],
    screen: TestConsentScreen,
    options: {headerTransparent: true},
  },
  {
    name: RouteName.INFO_SCREEN,
    regexs: ['/info'],
    screen: InfoScreen,
    options: {headerShown: false},
  },
];

const routes: AppRoutes = processRoutes(appRoutes);
export default routes;