import React, {useRef, useEffect} from 'react';
import {Animated} from 'react-native';
import {getIconSize} from '../../styles/iconSizes';
import {getColor, ColorType, Colors} from '../../styles/colors';
import {getSpace} from '../../styles/spaces';
import {IconProps, defaultProps, styles} from './Icon';

export type AnimatedIconProps = Omit<IconProps, 'iconName' | 'iconColor'> & {
  isSelected: boolean;
  selectedColor?: ColorType;
  normalColor?: ColorType;
  onAnimationFinish?: {(selected: boolean): void};
  enableAnimation?: boolean;
};

const animatedIconDefaultProps = {
  ...defaultProps,
  selectedColor: {color: Colors.primaryColor},
  normalColor: {color: Colors.black},
  enableAnimation: true,
};

export const AnimatedIcon: React.FC<AnimatedIconProps> = (props) => {
  const {
    style,
    iconSize,
    selectedColor,
    iconMargin,
    iconSourceUri,
    iconRef,
    isSelected,
    normalColor,
    onAnimationFinish,
    enableAnimation,
  } = props;

  const animatedColorValue = useRef(new Animated.Value(isSelected ? 100 : 0));
  const animateSpring = useRef(new Animated.Value(1));
  const colorInterpolation = useRef(
    animatedColorValue.current.interpolate({
      inputRange: [0, 100],
      outputRange: [getColor(normalColor, true), getColor(selectedColor, true)],
    }),
  );
  useEffect(() => {
    enableAnimation &&
      Animated.parallel([
        Animated.timing(animatedColorValue.current, {
          toValue: isSelected ? 100 : 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(animateSpring.current, {
          toValue: 1,
          tension: 55,
          velocity: 10,
          friction: 3,
          overshootClamping: true,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationFinish && onAnimationFinish(isSelected);
      });
  }, [animatedColorValue, enableAnimation, isSelected, onAnimationFinish]);

  const size = getIconSize(iconSize);
  const margin = getSpace(iconMargin);

  if (iconSourceUri) {
    return (
      <Animated.Image
        source={{uri: iconSourceUri}}
        ref={iconRef}
        style={[
          {
            height: size,
            width: size,
          },
          styles.container,
          {tintColor: colorInterpolation.current},
          {margin},
          style && style,
          {transform: [{scale: animateSpring.current}]},
        ]}
      />
    );
  }

  return null;
};

AnimatedIcon.defaultProps = animatedIconDefaultProps;
