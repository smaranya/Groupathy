import React, {useCallback, FunctionComponent, Fragment} from 'react';
import {StyleSheet, View, Dimensions, Alert} from 'react-native';
import {getColor, Colors} from '../../styles/colors';
import {FontStyles} from '../../styles/fonts/names';
import {IllnessSubgroupListResultsResponse} from './api/Models';
import handlePress from './handlePress';
import {PressType} from './constants';
import {Sizes} from '../../styles/fonts/sizes';
import {getSpace, Spaces} from '../../styles/spaces';
import {TextInImageWithShim} from '../../components/molecules/TextInImageWithShim';
import {TextView} from '../../components/atoms/TextView';
import {ImageResizeModes} from '../../styles/imageResizeMode';
import {TextIconView} from '../../components/molecules/TextIcon';
import {IconSizes} from '../../styles/iconSizes';
import {StackNavigationProp} from '@react-navigation/stack';
import {TouchableHighlight} from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 5}),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: getSpace(Spaces.small),
    marginHorizontal: getSpace(Spaces.xSmall),
    borderRadius: 20,
  },
  textViewStyle: {
    position: 'absolute',
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    marginTop: getSpace(Spaces.small),
    marginLeft: getSpace(Spaces.small),
  },
  textStyle: {
    textAlign: 'left',
  },
  lastScoreStyle: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 1,
    right: 1,
    flex: 1,
    marginBottom: getSpace(Spaces.small),
    marginRight: getSpace(Spaces.small),
  },
  scoreBackgroundStyle: {
    padding: getSpace(Spaces.xSmall),
    backgroundColor: getColor({color: Colors.buttonFill, opacity: 60}),
  },
  scoreTextStyle: {
    textAlign: 'center',
    justifyContent: 'flex-end',
    marginBottom: getSpace(Spaces.xSmall),
  },
});

export type IllnessGroupsItemProps = {
  data: IllnessSubgroupListResultsResponse;
  navigation?: StackNavigationProp<any, any>;
};

const IllnessGroupItem: FunctionComponent<IllnessGroupsItemProps> = (
  props: IllnessGroupsItemProps,
) => {
  const {
    navigation,
    data: {
      subGroupTypeId: id,
      subGroupType: groupSubType = '',
      subGroupTypeImageUrl: groupSubTypeImage = '',
      knowMoreUrl,
      lastScore,
      lastScoreOutOf,
      dateOfLastScore,
      initialText,
    } = {},
  } = props;

  const textProps = {
    fontFamily: FontStyles.bold,
    fontSize: Sizes.largePlus,
    textColor: {color: Colors.secondaryColor, opacity: 100},
  };

  const onImagePress = useCallback(() => {
    const pressData = {
      navigation,
      path: '/illness/detail',
      extraData: {
        groupId: id?.toString(),
        headerTitle: `${groupSubType}`,
        groupSubType: groupSubType,
        knowMoreUrl: knowMoreUrl,
        initialText: initialText,
        transparentHeader: true,
      },
    };
    handlePress({
      action: PressType.NAVIGATE,
      data: pressData,
    });
  }, [navigation, id, groupSubType, knowMoreUrl, initialText]);

  const imageWidth = Dimensions.get('window').width / 2 - 8;
  const containerStyle = {width: imageWidth, height: imageWidth};

  return (
    <TouchableHighlight
      underlayColor={getColor({color: Colors.white, opacity: 0})}
      onPress={onImagePress}
      style={[styles.container, containerStyle]}>
      <View>
        <TextInImageWithShim
          textProps={textProps}
          textPosition={'center'}
          imageProps={{
            sourceUri: groupSubTypeImage,
            aspectRatio: 1,
            width: imageWidth,
            resizeMode: ImageResizeModes.stretch,
          }}
          shimBackgroudColor={getColor({
            color: Colors.primaryGradient,
            opacity: 50,
          })}
        />
        <View style={styles.textViewStyle}>
          <TextView
            fontFamily={FontStyles.bold}
            fontSize={Sizes.largePlus}
            style={styles.textStyle}
            textColor={{color: Colors.white, opacity: 100}}>
            {groupSubType}
          </TextView>
        </View>
        {dateOfLastScore ? (
          <View style={styles.lastScoreStyle}>
            <TextView
              fontFamily={FontStyles.bold}
              fontSize={Sizes.medium}
              style={[styles.scoreTextStyle, styles.scoreBackgroundStyle]}
              textColor={{color: Colors.white, opacity: 100}}>
              {`Last Score: ${lastScore}/${lastScoreOutOf}`}
            </TextView>

            <TextIconView
              iconOnRight={false}
              iconProps={{
                iconSize: IconSizes.small,
                iconColor: {color: Colors.white, opacity: 100},
                iconName: 'today',
              }}
              text={`${dateOfLastScore}`}
              textProps={{
                fontFamily: FontStyles.bold,
                fontSize: Sizes.medium,
                textColor: {color: Colors.white, opacity: 100},
              }}
              styleTextIcon={styles.scoreTextStyle}
            />
          </View>
        ) : null}
      </View>
    </TouchableHighlight>
  );
};

export default IllnessGroupItem;
