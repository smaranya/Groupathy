import React, {FunctionComponent, useCallback} from 'react';
import {View, StyleSheet, Dimensions, Linking} from 'react-native';
import {getColor, Colors} from '../../styles/colors';
import {getSpace, Spaces} from '../../styles/spaces';
import {TextIconView} from './TextIcon';
import {FontStyles} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';
import {IconSizes} from '../../styles/iconSizes';
import {TextView} from '../atoms/TextView';
import {Button} from './Button';
import {IconProps} from '../atoms/Icon';

export type TherapistData = {
  name: string;
  imageUrl: string;
  designation: string;
  expertise: string;
  contactNumber: string;
  languages?: string;
};

export type ContactTherapistProps = {
  therapistData: TherapistData;
  onContactButtonClicked: {(contactNumber: string): void};
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor({color: Colors.white}),
    borderRadius: getSpace(Spaces.small),
    alignItems: 'center',
    margin: getSpace(Spaces.small),
  },

  therapistInfoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: getSpace(Spaces.xLarge),
    marginHorizontal: getSpace(Spaces.small),
    marginBottom: getSpace(Spaces.small),
  },
  therapistImage: {
    margin: getSpace(Spaces.small),
  },
  therapistName: {
    margin: getSpace(Spaces.small),
  },
  therapistDesignation: {margin: getSpace(Spaces.small)},
  helpText: {
    marginHorizontal: getSpace(Spaces.small),
    marginVertical: getSpace(Spaces.small),
  },
  expertiseText: {
    marginHorizontal: getSpace(Spaces.small),
    marginBottom: getSpace(Spaces.small),
    letterSpacing: 0.5,
  },
  buttonStyle: {
    marginHorizontal: getSpace(Spaces.largePlus),
    marginTop: getSpace(Spaces.medium),
    marginBottom: getSpace(Spaces.xLarge),
    borderRadius: 30,
    paddingVertical: getSpace(Spaces.small),
    paddingHorizontal: getSpace(Spaces.xxLarge),
    backgroundColor: getColor({color: Colors.buttonFill, opacity: 100}),
  },
  languageContainer: {
    flexDirection: 'row',
    marginBottom: getSpace(Spaces.small),
  },
  languageText: {
    marginLeft: getSpace(Spaces.small),
  },
});

const ContactTherapistView: FunctionComponent<ContactTherapistProps> = (
  props: ContactTherapistProps,
) => {
  const {
    therapistData: {
      name,
      imageUrl,
      designation,
      expertise,
      languages,
      contactNumber,
    },
    onContactButtonClicked,
  } = props;

  const {width} = Dimensions.get('window');

  const onClick = useCallback(() => {
    onContactButtonClicked && onContactButtonClicked(contactNumber);
  }, [onContactButtonClicked, contactNumber]);
  const iconProps = imageUrl
    ? ({
        style: styles.therapistImage,
        iconSize: IconSizes.vxxxLarge,
        iconColor: {color: Colors.secondaryColor, opacity: 0},
        iconSourceUri: imageUrl,
      } as IconProps)
    : ({
        style: styles.therapistImage,
        iconSize: IconSizes.vxxxLarge,
        iconColor: {color: Colors.secondaryColor, opacity: 60},
        iconName: 'person',
      } as IconProps);

  return (
    <View style={styles.container}>
      <TextIconView
        iconOnRight={false}
        iconProps={iconProps}
        text={`${name}`}
        subText={`${designation}`}
        textProps={{
          fontFamily: FontStyles.bold,
          fontSize: Sizes.largePlus,
          textColor: {color: Colors.secondaryColor, opacity: 80},
          style: styles.therapistName,
        }}
        subTextProps={{
          fontFamily: FontStyles.medium,
          fontSize: Sizes.large,
          textColor: {color: Colors.secondaryColor, opacity: 60},
          style: styles.therapistDesignation,
        }}
        styleTextIcon={[
          styles.therapistInfoContainer,
          {width: width - 2 * getSpace(Spaces.small)},
        ]}
        titleSubtitleDirection={'vertical'}
      />

      {languages ? (
        <View
          style={[
            styles.languageContainer,
            {
              width: width - 2 * getSpace(Spaces.large),
            },
          ]}>
          <TextView
            fontFamily={FontStyles.bold}
            fontSize={Sizes.large}
            textColor={{color: Colors.secondaryColor, opacity: 100}}>
            {'Knows:'}
          </TextView>
          <TextView
            style={styles.languageText}
            fontFamily={FontStyles.bold}
            fontSize={Sizes.large}
            textColor={{color: Colors.secondaryColor, opacity: 80}}>
            {languages}
          </TextView>
        </View>
      ) : null}

      <TextView
        style={[styles.helpText, {width: width - 2 * getSpace(Spaces.large)}]}
        fontFamily={FontStyles.bold}
        fontSize={Sizes.large}
        textColor={{color: Colors.secondaryColor, opacity: 100}}>
        {'Can help you with'}
      </TextView>

      <TextView
        style={[
          styles.expertiseText,
          {width: width - 2 * getSpace(Spaces.large)},
        ]}
        fontFamily={FontStyles.bold}
        fontSize={Sizes.large}
        textColor={{color: Colors.secondaryColor, opacity: 80}}>
        {expertise}
      </TextView>

      <Button
        style={[
          styles.buttonStyle,
          {width: width - 2 * getSpace(Spaces.large)},
        ]}
        touchableProps={{
          touchable: 'highLight',
          onPress: onClick,
        }}
        textProps={{
          textColor: {color: Colors.white},
          fontFamily: FontStyles.bold,
          fontSize: Sizes.largeMedPlus,
        }}
        text={'CALL NOW'}
      />
    </View>
  );
};
export default ContactTherapistView;
