import React from 'react';
import {View, StyleProp, ViewStyle} from 'react-native';
import {Spaces, getSpace} from '../../styles/spaces';
import {SeparatorSizes, getSeparatorSize} from '../../styles/separatorSizes';
import {ColorType, Colors, getColor} from '../../styles/colors';

const defaultProps = {
  height: SeparatorSizes.default,
  horizontalMargin: Spaces.noSpace,
  verticalMargin: Spaces.noSpace,
  color: {
    color: Colors.secondaryColor,
    opacity: 10,
  } as ColorType,
};

export type HorizontalSepratorProps = {
  width?: number;
  style?: StyleProp<ViewStyle>;
} & Partial<typeof defaultProps>;

export const HorizontalSeprator: React.FC<HorizontalSepratorProps> = (
  props,
) => {
  const {style, width, height, horizontalMargin, verticalMargin, color} = props;

  const marginHorizontal = getSpace(horizontalMargin);
  const marginVertical = getSpace(verticalMargin);
  const separatorHeight = getSeparatorSize(height);
  const separatorColor = getColor(color);

  const separatorStyle = {
    borderBottomWidth: separatorHeight,
    borderBottomColor: separatorColor,
    marginVertical,
    marginHorizontal,
    width,
  };

  return <View style={[separatorStyle, style]} />;
};

HorizontalSeprator.defaultProps = defaultProps;
