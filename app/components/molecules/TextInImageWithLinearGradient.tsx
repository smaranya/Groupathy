import React, {FunctionComponent, useCallback} from 'react';
import {StyleSheet, ViewStyle, View} from 'react-native';
import {ImageViewProps} from '../atoms/ImageView';
import {ImageBackgroundView} from '../atoms/ImageBackgroundView';
import {TextView, TextViewProps} from '../atoms/TextView';
import {Touchable} from './TouchableComponent';
import {getColor, Colors, ColorType} from '../../styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import {Sizes} from '../../styles/fonts/sizes';

const GRADIENT_COLORS: string[] = [
  getColor({color: Colors.black, opacity: 100}),
  getColor({color: Colors.white, opacity: 100}),
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Below 2 styles are to override container in Touchable
    justifyContent: undefined,
    alignItems: undefined,
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
});

const defaultProps = {
  textWithGradient: true,
  gradientColors: GRADIENT_COLORS as string[],
  imageProps: {
    imageStyle: styles.image,
  } as ImageViewProps,
  style: styles.container as ViewStyle,
  textPosition: 'end' as TextPosition,
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
  text?: string;
} & TextViewProps;

export type TextOverImageProps = {
  xtraData?: any;
  onPress?: {(xtraData: any): void};
  gradientColors?: string[];
} & Partial<typeof defaultProps>;

export const TextInImageWithLinearGradient: FunctionComponent<TextOverImageProps> = (
  props,
) => {
  const {
    onPress,
    xtraData,
    style,
    imageProps,
    textProps: {text = undefined, ...restTextProps} = {},
    gradientColors,
    textPosition,
  } = props;
  const onClick = useCallback(() => {
    onPress && onPress(xtraData);
  }, [onPress, xtraData]);

  const _textProps = {...defaultProps.textProps, ...restTextProps};
  const gradientColorsArray = gradientColors || [];
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
        style={styles.gradient}
        onPress={onClick}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={gradientColorsArray}
        />
      </Touchable>
    </View>
  );
};

TextInImageWithLinearGradient.defaultProps = defaultProps;
