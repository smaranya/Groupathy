import React, {PureComponent} from 'react';
import {FlatList, StyleSheet} from 'react-native';
import {IllnessSubgroupListResultsResponse} from './api/Models';
import IllnessGroupItem from './IllnessGroupItem';
import {Colors} from '../../styles/colors';
import {getSpace, Spaces} from '../../styles/spaces';
import {TextView} from '../../components/atoms/TextView';
import {SELECT_TEST_HEADER_TEXT} from '../../assets/stringLiterals';
import {FontStyles} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';
import {StackNavigationProp} from '@react-navigation/stack';
import {createTherapistData} from '../result-list/utils';
import ContactTherapistList from '../../components/compounds/ContactTherapistList';
import {TherapistInfo} from '../../typings/global';

const defaultStates = {
  illnessData: [] as Array<IllnessSubgroupListResultsResponse>,
  therapistData: [] as Array<TherapistInfo>,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    justifyContent: 'space-between',
  },
  headerTextStyle: {
    flex: 1,
    marginVertical: getSpace(Spaces.largePlus),
    marginHorizontal: getSpace(Spaces.xSmall),
    textAlign: 'center',
  },
});

type State = Partial<typeof defaultStates>;

export type IllnessListProps = {
  navigation: StackNavigationProp<any, any>;
  illnessData: Array<IllnessSubgroupListResultsResponse>;
  therapistData?: Array<TherapistInfo>;
};

class IllnessList extends PureComponent<IllnessListProps, State> {
  state: Readonly<State> = defaultStates;

  constructor(props: IllnessListProps) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
    this.keyExtractor = this.keyExtractor.bind(this);
  }

  // compare state and props for setting appropriate data
  static getDerivedStateFromProps(props: IllnessListProps, state: State) {
    if (
      props.illnessData &&
      props.illnessData.length > 0 &&
      props.illnessData.length !== state.illnessData?.length
    ) {
      return {
        ...state,
        illnessData: props.illnessData,
        therapistData: props.therapistData,
      };
    }
    return {
      ...state,
      illnessData: [],
      therapistData: props.therapistData,
    };
  }

  renderHeader = () => {
    return (
      <TextView
        style={[styles.headerTextStyle]}
        fontFamily={FontStyles.medium}
        fontSize={Sizes.large}
        textColor={{color: Colors.secondaryColor, opacity: 80}}>
        {SELECT_TEST_HEADER_TEXT}
      </TextView>
    );
  };

  renderItem({item}: {item: IllnessSubgroupListResultsResponse}) {
    return <IllnessGroupItem data={item} navigation={this.props.navigation} />;
  }

  keyExtractor(item: IllnessSubgroupListResultsResponse) {
    return item.subGroupTypeId.toString();
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
      <FlatList
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
        numColumns={2}
        data={this.state.illnessData}
        renderItem={this.renderItem}
        ListHeaderComponent={this.renderHeader}
        ListFooterComponent={this.renderFooter}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}

export default IllnessList;
