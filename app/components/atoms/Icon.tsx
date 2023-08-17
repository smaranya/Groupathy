import React, {FunctionComponent} from 'react';
import {Image, StyleSheet, ImageStyle, StyleProp, Alert} from 'react-native';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {IconSizes, getIconSize} from '../../styles/iconSizes';
import {getColor, ColorType} from '../../styles/colors';
import {Spaces, getSpace} from '../../styles/spaces';
import {ImageResizeModes, getResizeMode} from '../../styles/imageResizeMode';
import {RequireAtLeastOne} from '../../typings/global';
import {isUrl} from '../../utils';
import images from '../../assets/imageAssets';

export const styles = StyleSheet.create({
  container: {
    resizeMode: getResizeMode(ImageResizeModes.contain),
  } as ImageStyle,
});

export const defaultProps = {
  iconSize: IconSizes.medium,
  iconMargin: Spaces.xSmall,
};

type IconBaseProps = {
  style?: StyleProp<ImageStyle>;
  iconName?: string;
  iconSourceUri?: string;
  iconRef?: React.RefObject<any>;
  iconColor?: ColorType;
} & Partial<typeof defaultProps>;

export type IconProps = RequireAtLeastOne<
  IconBaseProps,
  'iconName' | 'iconSourceUri'
>;

export const Icon: FunctionComponent<IconProps> = (props) => {
  const {
    style,
    iconSize,
    iconColor,
    iconMargin,
    iconName,
    iconSourceUri,
    iconRef,
  } = props;

  const size = getIconSize(iconSize);
  const color = iconColor ? getColor(iconColor) : undefined;
  const margin = getSpace(iconMargin);

  if (iconName) {
    // return (
    //   // <MaterialIcon
    //   //   name={iconName}
    //   //   size={size}
    //   //   ref={iconRef}
    //   //   style={[{color}, {margin}, style && style]}
    //   // />
    // );
  }

  if (isUrl(iconSourceUri)) {
    return (
      <Image
        source={{uri: iconSourceUri}}
        ref={iconRef}
        style={[
          {
            height: size,
            width: size,
          },
          styles.container,
          {tintColor: undefined},
          {margin},
          style && style,
        ]}
      />
    );
  } else if (iconSourceUri) {
    return (
      <Image
        source={{uri: iconSourceUri}}
        ref={iconRef}
        style={[
          {
            height: size,
            width: size,
          },
          styles.container,
          {tintColor: undefined},
          {margin},
          style && style,
        ]}
      />
    );
  }

  return null;
};

Icon.defaultProps = defaultProps;
