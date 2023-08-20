import React, {FunctionComponent, useCallback, Fragment} from 'react';
import {StyleSheet, ViewStyle, View} from 'react-native';
import {ImageViewProps} from '../atoms/ImageView';
import {ImageBackgroundView} from '../atoms/ImageBackgroundView';
import {TextView, TextViewProps} from '../atoms/TextView';
import {Touchable} from './TouchableComponent';
import {getColor, Colors, ColorType} from '../../styles/colors';
import {Sizes} from '../../styles/fonts/sizes';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Below 2 styles are to override container in Touchable
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  center: {
    justifyContent: 'center',
  },
  start: {
    justifyContent: 'flex-start',
  },
  end: {
    justifyContent: 'flex-end',
  },
  shimImage: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
});

const defaultProps = {
  textWithGradient: true,
  imageProps: {
    imageStyle: styles.image,
  } as ImageViewProps,
  style: styles.container as ViewStyle,
  textPosition: 'end' as TextPosition,
  shimBackgroudColor: getColor({color: Colors.white, opacity: 50}),
  textProps: {
    textColor: {color: Colors.white} as ColorType,
    fontSize: Sizes.largePlus,
  } as TextProps,
};

const styleForText = (textPosition?: TextPosition) => {
  switch (textPosition) {
    case 'center':
      return styles.center;
    case 'start':
      return styles.start;
    default:
      return styles.end;
  }
};

export type TextPosition = 'start' | 'center' | 'end';

export type TextProps = {
  text?: string | undefined;
} & TextViewProps;

export type TextOverImageProps = {
  xtraData?: any;
  onPress?: {(xtraData: any): void};
  gradientColors?: string[];
} & Partial<typeof defaultProps>;

export const TextInImageWithShim: FunctionComponent<TextOverImageProps> = (
  props,
) => {
  const {
    onPress,
    xtraData,
    style,
    imageProps,
    textProps: {text, ...restTextProps} = {},
    textPosition,
    shimBackgroudColor,
  } = props;
  const onClick = useCallback(() => {
    onPress && onPress(xtraData);
  }, [onPress, xtraData]);

  const _textProps = {...defaultProps.textProps, ...restTextProps};
  return (
    <View style={[styles.container, style]}>
      {imageProps && imageProps.sourceUri ? (
        <ImageBackgroundView
          {...imageProps}
          style={[styleForText(textPosition), imageProps.style]}>
          <TextView {..._textProps}>{text}</TextView>
        </ImageBackgroundView>
      ) : null}
      <Touchable
        touchable={'highLight'}
        style={[styles.shimImage, {backgroundColor: shimBackgroudColor}]}
        onPress={onClick}>
        <Fragment />
      </Touchable>
    </View>
  );
};

TextInImageWithShim.defaultProps = defaultProps;
