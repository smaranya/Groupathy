import React, {FunctionComponent} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Icon} from './Icon';
import {Colors, getColor} from '../../styles/colors';
import {IconSizes} from '../../styles/iconSizes';
import {Spaces} from '../../styles/spaces';

const styles = StyleSheet.create({
  radioButtonHolder: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: getColor({
      color: Colors.white,
    }),
  },
});

export interface RadioButtonOptionViewProps {
  buttonStyle?: StyleProp<ViewStyle>;
  isSelected?: boolean;
  isSelectable?: boolean;
}

// @ts-ignore
const RadioButton: FunctionComponent<RadioButtonOptionViewProps> = (props) => {
  const {buttonStyle, isSelected, isSelectable} = props;

  return (
    <View
      style={[
        styles.radioButtonHolder,
        isSelectable
          ? isSelected
            ? {
                borderColor: getColor({color: Colors.buttonFill, opacity: 80}),
                backgroundColor: getColor({
                  color: Colors.buttonFill,
                  opacity: 80,
                }),
              }
            : {
                borderColor: getColor({
                  color: Colors.secondaryColor,
                  opacity: 60,
                }),
              }
          : {
              borderColor: getColor({
                color: Colors.secondaryColor,
                opacity: 40,
              }),
              backgroundColor: getColor({
                color: Colors.secondaryColor,
                opacity: 40,
              }),
            },
        buttonStyle,
      ]}>
      {isSelectable && isSelected ? (
        <Icon
          iconName={'check'}
          iconSize={IconSizes.small}
          iconMargin={Spaces.noSpace}
          iconColor={{color: Colors.white}}
        />
      ) : null}
    </View>
  );
};

export default RadioButton;
