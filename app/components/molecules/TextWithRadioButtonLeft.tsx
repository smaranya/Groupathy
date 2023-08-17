import React, {PureComponent} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {TextView, TextViewProps} from '../atoms/TextView';
import {getColor, Colors} from '../../styles/colors';
import {Sizes} from '../../styles/fonts/sizes';
import {FontStyles} from '../../styles/fonts/names';
import {getSpace, Spaces} from '../../styles/spaces';
import RadioButton from '../atoms/RadioButton';
import {Touchable} from './TouchableComponent';

const WhiteColor = getColor({color: Colors.white, opacity: 100});
const styles = StyleSheet.create({
  container: {
    margin: getSpace(Spaces.small),
    paddingVertical: getSpace(Spaces.medium),
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: WhiteColor,
    borderRadius: getSpace(Spaces.small),
  },
  mainView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  whiteBackground: {
    backgroundColor: WhiteColor,
  },
});

const defaultProps = {
  textProps: {
    fontFamily: FontStyles.regular,
    fontSize: Sizes.largeMedPlus,
    style: {
      marginHorizontal: getSpace(Spaces.small),
    },
    textColor: {color: Colors.secondaryColor, opacity: 80},
  } as TextViewProps,
  direction: 'vertical' as Direction,
  style: {...styles.whiteBackground} as ViewStyle,
  text: '',
  isOptionSelected: false,
};

const defaultStates = {
  isSelected: false,
};

export type State = Partial<typeof defaultStates>;

export type Direction = 'horizontal' | 'vertical';

export type TextWithRadioButtonLeftProps = {
  containerStyle?: ViewStyle;
  xtraData?: any;
  onPress?: {(xtraData: any): void};
} & Partial<typeof defaultProps>;

class TextWithRadioButtonLeft extends PureComponent<
  TextWithRadioButtonLeftProps,
  State
> {
  constructor(props: TextWithRadioButtonLeftProps) {
    super(props);
    this.onTextClick = this.onTextClick.bind(this);
    this.onPress = this.onPress.bind(this);
    this.state = defaultStates;
  }

  static getDerivedStateFromProps(
    props: TextWithRadioButtonLeftProps,
    state: State,
  ) {
    if (props.isOptionSelected !== state.isSelected) {
      return {
        ...state,
        isSelected: props.isOptionSelected,
      };
    }
    return {
      ...state,
    };
  }

  onTextClick() {
    this.setState({isSelected: !this.state.isSelected});
    this.props.onPress && this.props.onPress(this.props.xtraData);
  }

  onPress() {
    this.props.onPress && this.props.onPress(this.props.xtraData);
  }

  render() {
    const {containerStyle, text, textProps} = this.props;
    const textViewProps = {...defaultProps.textProps, textProps};
    return (
      <Touchable
        underlayColor={'transparent'}
        touchable={'highLight'}
        style={[styles.container, containerStyle]}
        onPress={this.onTextClick}>
        <View style={styles.mainView}>
          <RadioButton isSelectable isSelected={this.state.isSelected} />
          <TextView {...textViewProps}>{text}</TextView>
        </View>
      </Touchable>
    );
  }
}

export default TextWithRadioButtonLeft;
