import immutable from 'immutable';
import {IllnessSubgroupListResultsResponse} from '../screens/illness/api/Models';
import {StackNavigationProp} from '@react-navigation/stack';

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

type Dictionary<T> = Partial<{[key: string]: Readonly<T>}>;

interface ImmutableType<T, K = string, V = any> extends immutable.Map<K, V> {
  get<S extends keyof T>(key: S & K): T[S] & V;
  set<S extends keyof T>(key: K & S, value: T[S] & V): immutable.Map<K, V>;
  toJS(): T;
}

declare global {
  type Optional<T> = T | undefined;
}

export type PressProps = {
  action: string;
  data?: PressData;
};

export type PressData = {
  navigation?: StackNavigationProp<any, any>;
  path?: string;
  extraData?: any;
};

export type BaseListViewDataItem =
  | Array<RelatedTestItemData>
  | Array<NeedHelpItemData>;

export type RelatedTestItemData = {
  title: string;
  description: string;
  relatedIllness: Array<IllnessSubgroupListResultsResponse>;
};

export type NeedHelpItemData = {
  title: string;
  description: string;
  therapistData: Array<TherapistInfo>;
};

export type TherapistInfo = {
  name: string;
  imageUrl: string;
  description: string;
  expertise: string;
  languages: string;
  contactnumber: string;
  experience: string;
};
