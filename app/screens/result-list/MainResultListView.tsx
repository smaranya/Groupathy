import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {getColor, Colors} from '../../styles/colors';
import {getSpace, Spaces} from '../../styles/spaces';
import {TextView} from '../../components/atoms/TextView';
import {FontStyles} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';
// import {TextIconView} from '../../components/molecules/TextIcon';
// import {IconSizes} from '../../styles/iconSizes';
// import {VIEW_RESULT_HISTORY} from '../../assets/stringLiterals';
import {ResultListData, ResultListItem} from './ListViewModel';
import {StackNavigationProp} from '@react-navigation/stack';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  flatListContainer: {
    flex: 1,
    paddingHorizontal: getSpace(Spaces.medium),
    paddingBottom: getSpace(Spaces.subMedium),
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: getSpace(Spaces.small),
    padding: getSpace(Spaces.small),
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 40}),
  },
  itemHeaderContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: getSpace(Spaces.small),
    paddingHorizontal: getSpace(Spaces.small),
  },
  scoreTextStyle: {
    marginRight: getSpace(Spaces.subMedium),
  },
});

const defaultStates = {
  pastResultList: [] as ResultListData,
};

type State = Partial<typeof defaultStates>;

export type MainResultDeatilViewProps = {
  navigation: StackNavigationProp<any, any>;
  pastResultList: ResultListData;
};

export class MainResultListView extends PureComponent<
  MainResultDeatilViewProps,
  State
> {
  constructor(props: MainResultDeatilViewProps) {
    super(props);
    this.state = defaultStates;
  }

  componentDidMount() {
    this.setState({pastResultList: this.props.pastResultList});
  }

  renderItem = ({item}: {item: ResultListItem}) => {
    return (
      <View style={styles.itemContainer}>
        <TextView
          fontFamily={FontStyles.regular}
          fontSize={Sizes.largeMedPlus}
          textColor={{color: Colors.white}}>
          {item.dateTime}
        </TextView>
        <TextView
          style={styles.scoreTextStyle}
          fontFamily={FontStyles.regular}
          fontSize={Sizes.largeMedPlus}
          textColor={{color: Colors.white}}>
          {item.score}
        </TextView>
      </View>
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.itemHeaderContainer}>
        <TextView
          fontFamily={FontStyles.italicMedium}
          fontSize={Sizes.large}
          textColor={{color: Colors.white}}>
          {'Test Date'}
        </TextView>
        <TextView
          style={styles.scoreTextStyle}
          fontFamily={FontStyles.italicMedium}
          fontSize={Sizes.large}
          textColor={{color: Colors.white}}>
          {'Score'}
        </TextView>
      </View>
    );
  };

  keyExtractor = (item: ResultListItem, index: number) => {
    return index.toString();
  };

  render() {
    return (
      <FlatList
        data={this.state.pastResultList}
        showsVerticalScrollIndicator={false}
        renderItem={this.renderItem}
        ListHeaderComponent={this.renderHeader}
        keyExtractor={this.keyExtractor}
        style={styles.flatListContainer}
      />
    );
  }
}
