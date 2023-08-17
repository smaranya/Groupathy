import React from 'react';
import {
  Platform,
  View,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import RouteName from './RouteName';
import {TextView} from '../components/atoms/TextView';
import {FontStyles} from '../styles/fonts/names';
import {Sizes} from '../styles/fonts/sizes';
import {Colors, getColor} from '../styles/colors';
import {
  StackHeaderProps,
  StackNavigationProp,
} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {RouteProp} from '@react-navigation/native';
import {getSpace, Spaces} from '../styles/spaces';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {Icon} from '../components/atoms/Icon';
import {IconSizes} from '../styles/iconSizes';

export const HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const defaultHeaderTintColor = getColor({
  color: Colors.secondaryColor,
  opacity: 100,
});

const HeaderTitleMap = {
  [RouteName.HOME]: 'GROUPATHY',
  [RouteName.ILLNESS_GROUP]: 'GROUPATHY',
  [RouteName.INFO_SCREEN]: 'Please Note',
  [RouteName.ONBOARDING]: 'Welcome to Groupathy',
  [RouteName.RESULT_DETAIL]: 'Your Analysis',
  [RouteName.RESULT_LIST]: 'History',
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  titleStyle: {
    alignSelf: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
    letterSpacing: 1,
  },
  headerBack: {
    padding: getSpace(Spaces.small),
    justifyContent: 'center',
  },
});

// export type HeaderTitleProps = {
//   route: RouteProp<any, any>;
//   navigation: StackNavigationProp<any, any>;
// } & Partial<StackHeaderTitleProps>;

export type HeaderBackgroundProps = {
  route: RouteProp<any, any>;
  style: StyleProp<ViewStyle>;
};

// export type HeaderLeftProps = {
//   navigation: StackNavigationProp<any, any>;
// } & Partial<StackHeaderLeftButtonProps>;

// export const HeaderTitle = (props: HeaderTitle) => {
//   const {route, tintColor} = props;
//   const insets = useSafeAreaInsets();
//   const headerHeight = insets.top + HEADER_HEIGHT;
//   const title =
//     route.params && (route.params.headerTitle || route.params.title)
//       ? route.params.headerTitle || route.params.title
//       : HeaderTitleMap[route.name];
//   return (
//     <TextView
//       fontFamily={FontStyles.bold}
//       fontSize={Sizes.large}
//       style={[
//         styles.titleStyle,
//         {
//           height: headerHeight,
//           color: tintColor || defaultHeaderTintColor,
//           marginTop: 1.5 * insets.top,
//         },
//       ]}>
//       {title}
//     </TextView>
//   );
// };

export const DefaultHeaderBackGround = (props: HeaderBackgroundProps) => {
  const {route} = props;
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + HEADER_HEIGHT;
  return route.params?.transparentHeader ? (
    <View
      style={[
        styles.headerContainer,
        {height: headerHeight, width: Dimensions.get('window').width},
      ]}
    />
  ) : (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={[
        getColor({color: Colors.leftGradient}),
        getColor({color: Colors.rightGradient}),
      ]}
      style={[
        styles.headerContainer,
        {height: headerHeight, width: Dimensions.get('window').width},
      ]}
    />
  );
};

// export const HeaderLeft = (props: HeaderLeftProps) => {
//   const {canGoBack, navigation} = props;

//   const goBack = React.useCallback(() => {
//     canGoBack && navigation && navigation.goBack();
//   }, [navigation, canGoBack]);

//   if (canGoBack) {
//     return (
//       <TouchableHighlight
//         style={styles.headerBack}
//         underlayColor={'transparent'}
//         onPress={goBack}>
//         <Icon
//           iconName={'arrow-back'}
//           iconSize={IconSizes.medium}
//           iconMargin={Spaces.xSmall}
//           iconColor={{color: Colors.white}}
//         />
//       </TouchableHighlight>
//     );
//   }
//   return null;
//};
