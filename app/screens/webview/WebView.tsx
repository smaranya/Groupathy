import React, {createRef, PureComponent} from 'react';
//import {WebView} from 'react-native-webview';
import {Dimensions, StyleSheet, View} from 'react-native';
import {getSpace, Spaces} from '../../styles/spaces';
import {getColor, Colors} from '../../styles/colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
//import ProgressBar from '../../components/commons/CircularProgress';
import {Button} from '../../components/molecules/Button';
import {FontStyles} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor({color: Colors.white}),
    paddingBottom: '20%',
    paddingTop: '15%',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webViewStyle: {
    flex: 1,
  },
  goBackButtonStyle: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: '5%',
    borderRadius: 30,
    paddingVertical: getSpace(Spaces.subMedium),
    backgroundColor: getColor({color: Colors.buttonFill, opacity: 80}),
  },
  buttonText: {
    textAlign: 'center',
  },
});

const defaultState = {
  webViewUrl: '',
  isLoading: true,
};

export type State = Partial<typeof defaultState>;

export type AppWebViewProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

class AppWebView extends PureComponent<AppWebViewProps, State> {
  //webView = createRef<WebView>();
  canGoBack = false;
  constructor(props: AppWebViewProps) {
    super(props);
    this.state = defaultState;
  }

  componentDidMount() {
    this.setState({
      webViewUrl: this.props.route.params?.url,
    });
  }

  handleWebViewNavigationStateChange = (_event: any) => {};

  onLoadStart = () => {
    this.setState({isLoading: true});
  };

  onLoadFinish = () => {
    this.setState({isLoading: false});
  };

  renderProgressBar = () => {
    return (
      <View style={styles.progressBar}>
        {/* <ProgressBar /> */}
      </View>
    );
  };

  goBack = () => {
    this.props.navigation &&
      this.props.navigation.canGoBack() &&
      this.props.navigation.goBack();
  };

  render() {
    const buttonWidth =
      Dimensions.get('window').width - 2 * getSpace(Spaces.xxLarge);
    return (
      <View style={styles.container}>
        {/* <WebView
          style={styles.webViewStyle}
          onLoadStart={() => this.onLoadStart()}
          onLoad={() => this.onLoadFinish()}
          ref={this.webView}
          injectedJavaScript="window.postMessage(document.title)"
          cacheEnabled={true}
          source={{
            uri: this.state.webViewUrl || '',
          }}
          onNavigationStateChange={this.handleWebViewNavigationStateChange}
        /> */}
        {this.state.isLoading ? (
          this.renderProgressBar()
        ) : (
          <Button
            style={[styles.goBackButtonStyle, {width: buttonWidth}]}
            touchableProps={{
              touchable: 'highLight',
              disabled: false,
              onPress: this.goBack,
            }}
            textProps={{
              style: styles.buttonText,
              textColor: {color: Colors.white},
              fontFamily: FontStyles.bold,
              fontSize: Sizes.largeMedPlus,
            }}
            text={'Close'}
          />
        )}
      </View>
    );
  }
}

export default AppWebView;
