import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
//import ProgressBar from '../../components/commons/CircularProgress';
import React, {PureComponent} from 'react';
import {
  DeviceEventEmitter,
  EmitterSubscription,
  StyleSheet,
  View,
} from 'react-native';
import {getColor, Colors} from '../../styles/colors';
import {fetchIllnessSubGroups} from './api/ApiCalls';
import {IllnessSubgroupListResultsResponse} from './api/Models';
import IllnessList from './IllnessListContainer';
import {ApiError} from '../../networking/types';
import {HTTP_CODES} from '../../networking/constants';
import Snackbar from 'react-native-snackbar';
import {FontStyles, getName} from '../../styles/fonts/names';
import {ON_NEW_TEST_TAKEN} from '../../EventName';
import ContactTherapistList from '../../components/compounds/ContactTherapistList';
import {createTherapistData} from '../result-list/utils';
import {TherapistInfo} from '../../typings/global';

const defaultStates = {
  illnessData: [] as Array<IllnessSubgroupListResultsResponse>,
  therapistData: [] as Array<TherapistInfo>,
  isDataLoaded: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor({color: Colors.white, opacity: 100}),
  },
  progressBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type State = Partial<typeof defaultStates>;

export type IllnessGroupsScreenProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

export class IllnessGroups extends PureComponent<
  IllnessGroupsScreenProps,
  State
> {
  unSubscribeFocus?: any;
  eventListener?: EmitterSubscription;
  fetchNewData: boolean = false;

  constructor(props: IllnessGroupsScreenProps) {
    super(props);
    this.state = defaultStates;
    this.fetchIllnessGroups = this.fetchIllnessGroups.bind(this);
  }

  componentDidMount() {
    this.unSubscribeFocus = this.props.navigation.addListener(
      'focus',
      this.onFocus,
    );
    this.eventListener = DeviceEventEmitter.addListener(
      ON_NEW_TEST_TAKEN,
      this.onUpdateTest,
    );
    this.fetchIllnessGroups();
  }

  componentWillUnmount() {
    this.unSubscribeFocus && this.unSubscribeFocus();
    this.eventListener && this.eventListener.remove();
  }

  onFocus = () => {
    if (this.fetchNewData) {
      this.fetchNewData = false;
      this.fetchIllnessGroups();
    }
  };

  onUpdateTest = () => {
    this.fetchNewData = true;
  };

  async fetchIllnessGroups() {
    this.setState({isDataLoaded: false, illnessData: []});
    fetchIllnessSubGroups()
      .then((data) => {
        if (data && data.groupTypeList && data.groupTypeList.length > 0) {
          this.setState({
            illnessData: data.groupTypeList,
            isDataLoaded: true,
            therapistData: data.psychiatristData,
          });
          return;
        }
        this.setState({isDataLoaded: true});
      })
      .catch((error: ApiError) => {
        this.setState({isDataLoaded: true});
        switch (error.statusCode) {
          case HTTP_CODES.HTTP_NO_NETWORK:
          default:
            Snackbar.show({
              text: error.description,
              fontFamily: getName(FontStyles.medium),
              textColor: getColor({color: Colors.white}),
              backgroundColor: getColor({
                color: Colors.secondaryColor,
                opacity: 80,
              }),
              duration: Snackbar.LENGTH_INDEFINITE,
              action: {
                text: 'RETRY',
                textColor: getColor({color: Colors.buttonFill}),
                onPress: () => {
                  this.fetchIllnessGroups();
                },
              },
            });
        }
      });
  }

  renderFooter = () => {
    return this.state.therapistData && this.state.therapistData.length > 0 ? (
      <ContactTherapistList
        therapistData={createTherapistData(this.state.therapistData)}
      />
    ) : null;
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isDataLoaded ? (
          this.state.illnessData && this.state.illnessData.length > 0 ? (
            <IllnessList
              illnessData={this.state.illnessData}
              therapistData={this.state.therapistData}
              navigation={this.props.navigation}
            />
          ) : (
            this.renderFooter()
          )
        ) : (
          <View style={styles.progressBar}>
            {/* <ProgressBar /> */}
          </View>
        )}
      </View>
    );
  }
}

export default IllnessGroups;
