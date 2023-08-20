import React, {Component} from 'react';
import AppNavigator from './navigation/MainAppNavigator';
import SplashScreen from 'react-native-splash-screen';
import remoteConfig from '@react-native-firebase/remote-config';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
//import firebase from '@react-native-firebase/app';

const DEAFULT_SPLASH_UP_TIME = 1000;

class App extends Component {
  
  timeOutId: any;
  async componentDidMount() {
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 10000,
    });
    NetInfo.fetch().then((state: NetInfoState) => {
      console.log("This is the state" + state);
      if (state.isConnected) {
        this.fetchRemoteConfig(state);
      } else {
        SplashScreen.hide();
      }
    });
  }

  fetchRemoteConfig = async (state: NetInfoState) => {
    if (!state.isInternetReachable) {
      this.timeOutId = setTimeout(this.removeSplash, DEAFULT_SPLASH_UP_TIME);
      this.removeSplash();
    }
    remoteConfig()
      .fetchAndActivate()
      .then(() => {
        this.removeSplash();
      })
      .catch(() => {
        this.removeSplash();
      });
  };

  removeSplash = () => {
    SplashScreen.hide();
    this.timeOutId && clearTimeout(this.timeOutId); // Use clearTimeout instead of clearInterval
  };

  componentWillUnmount() {
    this.timeOutId && clearTimeout(this.timeOutId);
  }

  render() {
    return <AppNavigator />;
  }
}

export default App;