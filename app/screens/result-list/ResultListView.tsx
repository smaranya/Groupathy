import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {fetchGroupAnalytics} from './api/ApiCalls';
import {ResultListResponse} from './api/models';
import {
  ListViewModel,
  ListViewModelItem,
  ResultChartData,
} from './ListViewModel';
import {createViewModelData} from './utils';
import {
  VIEW_TYPE_CHART,
  VIEW_TYPE_RESULT_LIST,
  VIEW_TYPE_CONTACT_THERAPIST,
} from './constants';
import ResultChart from './ResultChart';
import {MainResultListView} from './MainResultListView';
import ContactTherapistList from '../../components/compounds/ContactTherapistList';
import {
  StackNavigationProp,
} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
//import ProgressBar from '../../components/commons/CircularProgress';
import {TextView} from '../../components/atoms/TextView';
import {getSpace, Spaces} from '../../styles/spaces';
import {Button} from '../../components/molecules/Button';
import {Colors, getColor} from '../../styles/colors';
import {FontStyles} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';
//import navigateTo from '../../navigation/navigateTo';
import {NO_TEST_HISTORY} from '../../assets/stringLiterals';
import {HEADER_HEIGHT} from '../../navigation/headerOptions';
//import {capitalizeFirstLetter} from '../../utils';

const defaultStates = {
  resultData: [] as ListViewModel,
  maxScore: 0,
  isDataLoaded: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: HEADER_HEIGHT,
    backgroundColor: getColor({color: Colors.leftGradient}),
  },
  progressBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultTextStyle: {
    flex: 1,
    backgroundColor: getColor({color: Colors.leftGradient}),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    marginHorizontal: getSpace(Spaces.largePlus),
    marginTop: getSpace(Spaces.medium),
    marginBottom: getSpace(Spaces.xLarge),
    borderRadius: 30,
    paddingVertical: getSpace(Spaces.small),
    paddingHorizontal: getSpace(Spaces.xxLarge),
    backgroundColor: getColor({color: Colors.buttonFill, opacity: 60}),
  },
  textViewStyle: {
    textAlign: 'center',
  },
});

type State = Partial<typeof defaultStates>;

export type ResultViewProps = {
  navigation: StackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

class ResultListView extends PureComponent<ResultViewProps, State> {
  maxScore: number = 0;
  constructor(props: ResultViewProps) {
    super(props);
    this.state = defaultStates;
  }

  async componentDidMount() {
    if (this.props.route.params?.groupId) {
      const data = await fetchGroupAnalytics(this.props.route.params?.groupId);
      if (
        data &&
        data.analyticsResultHistory &&
        data.analyticsResultHistory.length > 0
      ) {
        this.setState({
          resultData: createViewModelData(data),
          maxScore: this.getMaxScore(data),
        });
      }
    }
    this.setState({
      isDataLoaded: true,
    });
  }

  getMaxScore = (resultData: ResultListResponse): number => {
    return resultData.analyticsResultHistory[0].scoreOutOf;
  };

  renderItem = ({item}: {item: ListViewModelItem}) => {
    const {type = ''} = item;
    switch (type) {
      case VIEW_TYPE_CHART:
        return (
          <ResultChart
            maxScore={this.state.maxScore || 100}
            chartData={item.data as ResultChartData}
          />
        );
      case VIEW_TYPE_RESULT_LIST:
        return (
          <MainResultListView
            navigation={this.props.navigation}
            pastResultList={item.data}
          />
        );
      case VIEW_TYPE_CONTACT_THERAPIST:
        return <ContactTherapistList therapistData={item.data} />;
    }
    return null;
  };

  keyExtractor = (item: ListViewModelItem, index: number) => {
    return index.toString();
  };

  goToTakeTestPage = () => {
    // navigateTo({
    //   navigation: this.props.navigation,
    //   path: '/questionnaire/groups',
    //   params: {
    //     groupId: this.props.route.params?.groupId,
    //     transparentHeader: true,
    //     headerTitle: `${capitalizeFirstLetter(
    //       this.props.route.params?.groupSubType,
    //     )} Test`,
    //   },
    //   replace: true,
    // });
  };

  renderNoResultView = () => {
    return (
      <View style={styles.noResultTextStyle}>
        <TextView
          style={styles.textViewStyle}
          fontFamily={FontStyles.medium}
          fontSize={Sizes.largeMedPlus}
          textColor={{color: Colors.white}}>
          {NO_TEST_HISTORY}
        </TextView>
        <Button
          style={styles.buttonStyle}
          touchableProps={{
            touchable: 'highLight',
            onPress: this.goToTakeTestPage,
          }}
          textProps={{
            textColor: {color: Colors.white},
            fontFamily: FontStyles.medium,
            fontSize: Sizes.large,
          }}
          text={'Take Test'}
        />
      </View>
    );
  };

  render() {
    return (
      <View></View>
      // <HeaderHeightContext.Consumer>
      //   {(headerHeight: any) => (
      //     <View style={[styles.container, {paddingTop: headerHeight}]}>
      //       {this.state.resultData && this.state.resultData.length > 0 ? (
      //         <FlatList
      //           data={this.state.resultData}
      //           showsVerticalScrollIndicator={false}
      //           keyExtractor={this.keyExtractor}
      //           renderItem={this.renderItem}
      //         />
      //       ) : this.state.isDataLoaded ? (
      //         this.renderNoResultView()
      //       ) : (
      //         <View style={styles.progressBar}>
      //           <ProgressBar />
      //         </View>
      //       )}
      //     </View>
      //   )}
      // </HeaderHeightContext.Consumer>
    );
  }
}

export default ResultListView;
