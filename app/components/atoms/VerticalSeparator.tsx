import React, {StatelessComponent} from 'react';
import {View} from 'react-native';
import {Spaces, getSpace} from '../../styles/spaces';
import {SeparatorSizes, getSeparatorSize} from '../../styles/separatorSizes';
import {ColorType, Colors, getColor} from '../../styles/colors';

const defaultProps = {
  width: SeparatorSizes.default,
  horizontalMargin: Spaces.noSpace,
  verticalMargin: Spaces.noSpace,
  color: {
    color: Colors.secondaryColor,
  } as ColorType,
};

export type VerticalSeparatorProps = {
  height: number;
} & Partial<typeof defaultProps>;

export const VerticalSeparator: StatelessComponent<VerticalSeparatorProps> = (
  props,
) => {
  const {width, height, horizontalMargin, verticalMargin, color} = props;

  if (!height) {
    return null;
  }

  const marginHorizontal = getSpace(horizontalMargin);
  const marginVertical = getSpace(verticalMargin);
  const separatorWidth = getSeparatorSize(width);
  const separatorHeight = getSpace(height);
  const separatorColor = getColor(color);

  const separatorStyle = {
    width: separatorWidth,
    backgroundColor: separatorColor,
    height: separatorHeight,
    marginHorizontal,
    marginVertical,
  };

  return <View style={separatorStyle} />;
};

VerticalSeparator.defaultProps = defaultProps;
