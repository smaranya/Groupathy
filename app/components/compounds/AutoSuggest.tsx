import React, {PureComponent, useCallback} from 'react';
import {Colors, getColor} from '../../styles/colors';
import {FontStyles, getName} from '../../styles/fonts/names';
import {getSize, Sizes} from '../../styles/fonts/sizes';
import {getSpace, Spaces} from '../../styles/spaces';
import {
  FlatList,
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
  ViewStyle,
} from 'react-native';
import {HorizontalSeprator} from '../atoms/HorizontalSeparator';
import {TextView} from '../atoms/TextView';
import {Icon} from '../atoms/Icon';
import {getIconSize, IconSizes} from '../../styles/iconSizes';

const defaultState = {
  data: [] as Array<string>,
  currentText: '',
  filteredData: [] as Array<string>,
  showIcon: true,
};

const defaultProps = {
  placeholder: 'Start typing to search',
};

type State = Partial<typeof defaultState>;
export type AutoSuggestProps = {
  data: Array<string>;
  containerWidth: number;
  onOptionSelected: {(selectedOption: string): void};
  placeholder?: string;
  containerStyle?: StyleProp<ViewStyle>;
} & Partial<typeof defaultProps>;

const styles = StyleSheet.create({
  container: {
    backgroundColor: getColor({color: Colors.white}),
    alignItems: 'center',
    justifyContent: 'center',
  },
  flatListcontainer: {
    height: 200,
    shadowColor: 'transparent',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    elevation: 2,
    marginLeft: getSpace(Spaces.small),
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 5}),
  },
  serachInput: {
    paddingVertical: getSpace(Spaces.small),
    paddingHorizontal: getSpace(Spaces.small),
    marginHorizontal: getSpace(Spaces.xSmall),
    backgroundColor: getColor({color: Colors.white}),
    marginTop: getSpace(Spaces.medium),
    fontFamily: getName(FontStyles.regular),
    fontSize: getSize(Sizes.large),
    color: getColor({color: Colors.secondaryColor}),
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 4,
    borderColor: getColor({color: Colors.secondaryColor, opacity: 40}),
  },
  listContainer: {
    padding: getSpace(Spaces.subMedium),
  },
  separator: {
    marginVertical: getSpace(Spaces.xSmall),
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 20}),
  },
  suggestionTextStyle: {
    paddingHorizontal: getSpace(Spaces.small),
    paddingVertical: getSpace(Spaces.xSmall),
  },
  inputConatiner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconView: {
    alignSelf: 'center',
    position: 'absolute',
    top: '30%',
    marginTop: getSpace(Spaces.small),
  },
  optionItemStyle: {
    paddingVertical: getSpace(Spaces.small),
  },
});

const AutoSuggestItem = ({
  item,
  onOptionSelect,
}: {
  item: string;
  onOptionSelect?: {(option: string): void};
}) => {
  const onPress = useCallback(() => {
    onOptionSelect && onOptionSelect(item);
  }, [item, onOptionSelect]);
  return (
    <TouchableHighlight style={styles.optionItemStyle} onPress={onPress}>
      <TextView
        style={styles.suggestionTextStyle}
        fontFamily={FontStyles.medium}
        fontSize={Sizes.medium}>
        {item}
      </TextView>
    </TouchableHighlight>
  );
};

class AutoSuggest extends PureComponent<AutoSuggestProps, State> {
  constructor(props: AutoSuggestProps) {
    super(props);
    this.state = {
      data: props.data,
      currentText: '',
      filteredData: [],
      showIcon: true,
    };
  }

  static getDerivedStateFromProps(props: AutoSuggestProps, state: State) {
    if (
      props.data &&
      props.data.length > 0 &&
      props.data.length !== state.data?.length
    ) {
      return {
        ...state,
        data: props.data,
      };
    }
  }

  onOptionSelected = (text: string) => {
    this.setState({currentText: text, filteredData: []});
    this.props.onOptionSelected && this.props.onOptionSelected(text);
  };

  renderItem = ({item}: {item: string}) => {
    return (
      <AutoSuggestItem item={item} onOptionSelect={this.onOptionSelected} />
    );
  };

  keyExtractor = (item: String, index: number) => {
    item = item || '';
    return `${item}${index}`;
  };

  renderSeparator = () => {
    const separatorWidth = this.props.containerWidth || 0;
    return (
      <HorizontalSeprator
        width={separatorWidth}
        color={{color: Colors.secondaryColor, opacity: 20}}
        height={StyleSheet.hairlineWidth}
      />
    );
  };

  filterStringData = (currentText: string) => {
    let filteredChoices = [] as Array<string>;
    currentText &&
      this.state.data &&
      this.state.data.map((entry: string) => {
        if (entry.toLowerCase().includes(currentText.toLowerCase())) {
          filteredChoices.push(entry);
        }
      });
    return filteredChoices;
  };

  handleTextChange = (newText: string) => {
    if (!newText) {
      this.setState({
        filteredData: [],
        currentText: '',
        showIcon: true,
      });
      this.props.onOptionSelected && this.props.onOptionSelected(newText);
      return;
    }
    this.setState({
      currentText: newText,
      filteredData: this.filterStringData(newText),
      showIcon: false,
    });
    this.props.onOptionSelected && this.props.onOptionSelected(newText);
  };

  render() {
    const {containerWidth, placeholder, containerStyle} = this.props;
    const containerWidthStyle = {width: containerWidth - 2 * Spaces.large};
    const iconStyle = {
      left: containerWidthStyle.width - getIconSize(IconSizes.large),
    };
    return (
      <View style={[styles.container, containerWidthStyle]}>
        <View style={[styles.inputConatiner, containerWidthStyle]}>
          <TextInput
            style={[styles.serachInput, containerWidthStyle]}
            value={this.state.currentText}
            placeholder={placeholder || defaultProps.placeholder}
            onChangeText={this.handleTextChange}
          />
          {this.state.showIcon ? (
            <Icon
              iconName={'search'}
              style={[styles.iconView, iconStyle]}
              iconSize={IconSizes.medium}
              iconColor={{color: Colors.secondaryColor}}
            />
          ) : null}
        </View>
        {this.state.filteredData && this.state.filteredData.length > 0 ? (
          <FlatList
            extraData={this.state.filteredData}
            style={[styles.flatListcontainer, containerWidthStyle]}
            showsVerticalScrollIndicator={false}
            data={this.state.filteredData}
            ItemSeparatorComponent={this.renderSeparator}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
          />
        ) : null}
      </View>
    );
  }
}

export default AutoSuggest;
