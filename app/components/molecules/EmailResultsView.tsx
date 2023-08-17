import React, {FunctionComponent, useState, useCallback} from 'react';
import {View, StyleSheet, Dimensions, TextInput, Alert} from 'react-native';
import {Colors, getColor} from '../../styles/colors';
import {FontStyles, getName} from '../../styles/fonts/names';
import {Sizes, getSize} from '../../styles/fonts/sizes';
import {getSpace, Spaces} from '../../styles/spaces';
import {TextView, TextViewProps} from '../../components/atoms/TextView';
import {Button} from './Button';
import {checkValidEmail} from '../../utils';
import Snackbar from 'react-native-snackbar';

const defaultProps = {
  titleTextProps: {
    fontSize: Sizes.largePlus,
    fontFamily: FontStyles.bold,
    textColor: {color: Colors.white},
  },
  subTitleTextProps: {
    fontSize: Sizes.large,
    fontFamily: FontStyles.regular,
    textColor: {color: Colors.white},
  },
  title: 'EMAIL YOUR RESULTS',
  subTitle: 'Email the results to youself or share with someone.',
  placeholder: 'Enter email address',
  buttonText: 'SEND RESULTS',
};

export type EmailResultViewProps = {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  titleTextProps?: TextViewProps;
  subTitleTextProps?: TextViewProps;
  placeholder?: string;
  onSendEmail?: {(text: string): void};
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: getSpace(Spaces.small),
    marginHorizontal: getSpace(Spaces.small),
    backgroundColor: getColor({color: Colors.leftGradient, opacity: 100}),
  },
  titleStyle: {
    marginTop: getSpace(Spaces.medium),
    letterSpacing: 1,
  },
  subTitleStyle: {
    marginTop: getSpace(Spaces.medium),
  },
  emailInput: {
    flex: 1,
    paddingVertical: getSpace(Spaces.xSmall),
    paddingHorizontal: getSpace(Spaces.xSmall),
    backgroundColor: getColor({color: Colors.white}),
    marginTop: getSpace(Spaces.medium),
    fontFamily: getName(FontStyles.regular),
    fontSize: getSize(Sizes.large),
    color: getColor({color: Colors.secondaryColor}),
    alignItems: 'center',
  },
  buttonStyle: {
    paddingVertical: getSpace(Spaces.small),
    paddingHorizontal: getSpace(Spaces.xxLarge),
    backgroundColor: getColor({color: Colors.buttonFill, opacity: 80}),
    marginVertical: getSpace(Spaces.medium),
    marginTop: getSpace(Spaces.xxLarge),
    marginBottom: getSpace(Spaces.medium),
    borderRadius: 20,
  },
  buttonDisabledStyle: {
    borderWidth: getSpace(Spaces.xSmall) / 2,
    paddingVertical: getSpace(Spaces.small),
    paddingHorizontal: getSpace(Spaces.subMedium),
    borderColor: getColor({color: Colors.primaryColor}),
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 80}),
    marginTop: getSpace(Spaces.large),
    marginBottom: getSpace(Spaces.medium),
  },
});

const EmailResultsView: FunctionComponent<EmailResultViewProps> = (
  props: EmailResultViewProps,
) => {
  const {
    title,
    titleTextProps = {} as TextViewProps,
    subTitleTextProps,
    buttonText,
    subtitle,
    placeholder,
    onSendEmail,
  } = props;

  const [text, setText] = useState('');

  const onClick = useCallback(() => {
    if (checkValidEmail(text)) {
      onSendEmail && onSendEmail(text);
    } else {
      Snackbar.show({
        text: 'Please enter a valid email',
        fontFamily: getName(FontStyles.medium),
        textColor: getColor({color: Colors.white}),
        backgroundColor: getColor({
          color: Colors.error,
          opacity: 100,
        }),
        duration: Snackbar.LENGTH_LONG,
      });
    }
  }, [onSendEmail, text]);

  const _titleTextProps = {...defaultProps.titleTextProps, ...titleTextProps};
  const _subTitleTextProps = {
    ...defaultProps.subTitleTextProps,
    ...subTitleTextProps,
  };

  const emailInputStyle = {
    width: Dimensions.get('window').width - 2 * getSpace(Spaces.large),
  };
  return (
    <View style={[styles.container, {width: Dimensions.get('window').width}]}>
      <TextView {..._titleTextProps} style={styles.titleStyle}>
        {title || defaultProps.title}
      </TextView>
      <TextView {..._subTitleTextProps} style={styles.subTitleStyle}>
        {subtitle || defaultProps.subTitle}
      </TextView>
      <TextInput
        style={[styles.emailInput, emailInputStyle]}
        value={text}
        placeholder={placeholder || defaultProps.placeholder}
        onChangeText={(newText) => setText(newText)}
      />
      <Button
        style={[styles.buttonStyle]}
        touchableProps={{
          touchable: 'highLight',
          onPress: onClick,
          disabled: false,
        }}
        textProps={{
          textColor: {color: Colors.white},
          fontFamily: FontStyles.bold,
          fontSize: Sizes.large,
        }}
        disabledStyle={styles.buttonDisabledStyle}
        text={buttonText || defaultProps.buttonText}
      />
    </View>
  );
};

export default EmailResultsView;
