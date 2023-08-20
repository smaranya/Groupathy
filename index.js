/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './app/index';
import {name as appName} from './app.json';
import { enableScreens } from 'react-native-screens';
import { firebase } from '@react-native-firebase/app';

enableScreens();

    const firebaseConfig = {
      apiKey: "AIzaSyCMmOUzhomPzEiHY0LIIlkG4QnedzmzJF8",
      authDomain: "groupathy-f41d3.firebaseapp.com",
      projectId: "groupathy-f41d3",
      storageBucket: "groupathy-f41d3.appspot.com",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "1:700158952884:android:e1b67b3867a03248639ee1",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }


AppRegistry.registerComponent(appName, () => App);