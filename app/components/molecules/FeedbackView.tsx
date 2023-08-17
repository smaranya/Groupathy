import React, {useCallback, FunctionComponent} from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {Colors, getColor} from '../../styles/colors';
import {getSpace, Spaces} from '../..//styles/spaces';
import {TextView} from '../atoms/TextView';
import {FontStyles} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';
import {Button} from './Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 80}),
    alignItems: 'center',
    padding: getSpace(Spaces.medium),
  },
  title: {
    alignItems: 'center',
    marginTop: getSpace(Spaces.medium),
    letterSpacing: 1,
  },
  description: {
    alignItems: 'center',
    textAlign: 'center',
    marginTop: getSpace(Spaces.small),
    marginBottom: getSpace(Spaces.large),
  },
  buttonStyle: {
    paddingHorizontal: getSpace(Spaces.xxLarge),
    paddingVertical: getSpace(Spaces.small),
    marginVertical: getSpace(Spaces.small),
    borderRadius: 30,
    backgroundColor: getColor({color: Colors.buttonFill, opacity: 80}),
  },
});

export type FeedbackViewProps = {
  title: string;
  description: string;
  buttonText: string;
  containerStyle?: ViewStyle;
  titleStyle?: ViewStyle;
  descriptionStyle?: ViewStyle;
  buttonStyle?: ViewStyle;
  onSubmitFeedback?: {(): void};
};

const FeedBackView: FunctionComponent<FeedbackViewProps> = ({
  title,
  description,
  buttonText,
  descriptionStyle = {},
  titleStyle = {},
  containerStyle = {},
  buttonStyle = {},
  onSubmitFeedback,
}) => {
  const onGiveFeedBackClick = useCallback(() => {
    onSubmitFeedback && onSubmitFeedback();
  }, [onSubmitFeedback]);

  if (!title || !description || !buttonText) {
    return null;
  }
  return (
    <View style={[styles.container, containerStyle]}>
      <TextView
        style={[styles.title, titleStyle]}
        fontSize={Sizes.xLarge}
        textColor={{color: Colors.white}}
        fontFamily={FontStyles.bold}>
        {title}
      </TextView>
      <TextView
        style={[styles.description, descriptionStyle]}
        fontSize={Sizes.large}
        textColor={{color: Colors.white}}
        fontFamily={FontStyles.italicMedium}>
        {description}
      </TextView>
      <Button
        style={[styles.buttonStyle, buttonStyle]}
        touchableProps={{
          touchable: 'highLight',
          onPress: onGiveFeedBackClick,
        }}
        textProps={{
          textColor: {color: Colors.white},
          fontFamily: FontStyles.bold,
          fontSize: Sizes.large,
        }}
        text={buttonText}
      />
    </View>
  );
};

export default FeedBackView;
