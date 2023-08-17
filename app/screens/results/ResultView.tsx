import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableHighlight,
  Platform,
  Linking,
} from 'react-native';
import {getColor, Colors} from '../../styles/colors';
import {ResultViewModel, ListDataViewModel} from './viewModels';
import {fetchResultDetail} from './api/ApiCalls';
import {convertToListViewModel} from './utils';
import FeedBackView from '../../components/molecules/FeedbackView';
import {MainResultDeatilView} from './MainResultDetailView';
import {
  VIEW_TYPE_FEEDBACK,
  VIEW_TYPE_MAIN_RESULT,
  VIEW_TYPE_CONTACT_THERAPIST,
} from './constants';
import handlePress, {PressType} from './handlePress';
import ContactTherapistList from '../../components/compounds/ContactTherapistList';
import {RouteProp} from '@react-navigation/native';
import {
  // HeaderHeightContext,
  StackNavigationProp,
} from '@react-navigation/stack';
import {getSpace, Spaces} from '../../styles/spaces';
import {Icon} from '../../components/atoms/Icon';
import {IconSizes} from '../../styles/iconSizes';
import {FontStyles, getName} from '../../styles/fonts/names';
import Snackbar from 'react-native-snackbar';
//import ProgressBar from '../../components/commons/CircularProgress';

const defaultStates = {
  resultData: [] as Array<ListDataViewModel>,
  isLoading: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor({color: Colors.leftGradient}),
  },
  headerBack: {
    padding: getSpace(Spaces.small),
    justifyContent: 'center',
  },
  progressBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

type State = Partial<typeof defaultStates>;

export type ResultViewProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

export default class ResultView extends PureComponent<ResultViewProps, State> {
  //resultData: ResultViewModel = {};
  constructor(props: ResultViewProps) {
    super(props);
    this.state = defaultStates;
  }

  async componentDidMount() {
    this.props.navigation.setOptions({
      headerLeft: () => (
        <TouchableHighlight
          style={styles.headerBack}
          underlayColor={'transparent'}
          onPress={this.onHomePress}>
          <Icon
            iconName={'home'}
            iconSize={IconSizes.medium}
            iconMargin={Spaces.xSmall}
            iconColor={{color: Colors.white}}
          />
        </TouchableHighlight>
      ),
    });
    if (this.props.route.params?.resultData) {
      this.setState({
        resultData: convertToListViewModel(this.props.route.params?.resultData),
      });
    } else if (this.props.route.params?.resulId) {
      const data = await fetchResultDetail(this.props.route.params?.resulId);
      this.setState({
        resultData: convertToListViewModel(data),
      });
    }
  }

  onHomePress = () => {
    this.props.navigation && this.props.navigation.popToTop();
  };

  onClickHistory = () => {
    const pressData = {
      navigation: this.props.navigation,
      path: '/group/result-list',
      extraData: {
        groupId: this.props.route.params?.groupId,
        headerTitle: 'Analysis History',
        transparentHeader: 'true',
      },
    };
    handlePress({
      action: PressType.NAVIGATE,
      data: pressData,
    });
  };

  openMarket = () => {
    const appId = Platform.OS === 'android' ? 'com.groupathy' : '';
    const marketUrl = `market://details?id=${appId}`;
    const errorMessage = Platform.OS === 'android' ? 'Play Store' : 'App Store';
    Linking.canOpenURL(marketUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(marketUrl);
        } else {
          Snackbar.show({
            text: `Cannot redirect to ${errorMessage}. Sorry for the incovinience.`,
            fontFamily: getName(FontStyles.medium),
            textColor: getColor({color: Colors.white}),
            backgroundColor: getColor({
              color: Colors.error,
              opacity: 100,
            }),
            duration: Snackbar.LENGTH_LONG,
          });
        }
      })
      .catch(() => {
        Snackbar.show({
          text: `Cannot redirect to ${errorMessage}. Sorry for the incovinience.`,
          fontFamily: getName(FontStyles.medium),
          textColor: getColor({color: Colors.white}),
          backgroundColor: getColor({
            color: Colors.error,
            opacity: 100,
          }),
          duration: Snackbar.LENGTH_LONG,
        });
      });
  };

  onSubmitFeedback = () => {
    const heading = Platform.OS === 'android' ? 'Play Store' : 'App Store';
    Alert.alert(
      `${heading} Redirection`,
      'You will be redirected to app/play store, for giving feedback. Click "YES" to continue.',
      [
        {
          text: 'Yes',
          onPress: () => this.openMarket(),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  toggleProgressBar = (value: boolean) => {
    this.setState({isLoading: value});
  };

  renderItem = ({item}: {item: ListDataViewModel}) => {
    const {type} = item;
    switch (type) {
      case VIEW_TYPE_MAIN_RESULT:
        return (
          <MainResultDeatilView
            navigation={this.props.navigation}
            title={item.data.title}
            score={item.data.score}
            scoreOutOf={item.data.scoreOutOf}
            analysis={item.data.analysis}
            toggleProgressBar={this.toggleProgressBar}
            onClickHistory={this.onClickHistory}
          />
        );
      case VIEW_TYPE_FEEDBACK:
        return (
          <FeedBackView
            title={item.data.title}
            description={item.data.description}
            buttonText={item.data.buttonText}
            onSubmitFeedback={this.onSubmitFeedback}
          />
        );
      case VIEW_TYPE_CONTACT_THERAPIST:
        return <ContactTherapistList therapistData={item.data} />;
      default:
        break;
    }
    return null;
  };

  keyExtractor = (item: ListDataViewModel) => {
    return item.type;
  };

  renderProgressBar = () => {
    return (
      <View style={styles.progressBar}>
        {/* <ProgressBar /> */}
      </View>
    );
  };

  render() {
    return (
      //<HeaderHeightContext.Consumer>
        // {() => (
          <View style={styles.container}>
            {this.state.isLoading ? (
              this.renderProgressBar()
            ) : (
              <FlatList
                data={this.state.resultData}
                showsVerticalScrollIndicator={false}
                keyExtractor={this.keyExtractor}
                renderItem={this.renderItem}
              />
            )}
          </View>
        // )}
      //</HeaderHeightContext.Consumer>
    );
  }
}