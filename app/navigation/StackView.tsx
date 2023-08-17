import React from 'react';
import routes, {Route} from './routes';
import {createStackNavigator} from '@react-navigation/stack';
import {
  DefaultHeaderBackGround,
} from './headerOptions';
import {Colors, getColor} from '../styles/colors';

const Stack = createStackNavigator();

export type StackViewProps = {
  initialRouteName: string;
  initialParams: any;
};

const StackView = (props: StackViewProps) => {
  return (
    <Stack.Navigator
      screenOptions={({route, navigation}) => ({
        // headerTitle: (headerTitleProps) => (
        //   // <HeaderTitle
        //   //   {...headerTitleProps}
        //   //   route={route}
        //   //   navigation={navigation}
        //   // />
        // ),
        headerTitleAlign: 'center',
        headerBackTitle: undefined,
        // headerBackground: (headerBackgroundProps) => (
        //   // <HeaderTitle {...headerBackgroundProps} route={route} />
        // ),
        headerTintColor: getColor({color: Colors.white}),
        // headerLeft: (headerLeftProps) => (
        //   <HeaderLeft navigation={navigation} {...headerLeftProps} />
        // ),
      })}
      initialRouteName={props.initialRouteName}>
      {getAllNavigationScreens(
        routes,
        props.initialParams,
        props.initialRouteName,
      )}
    </Stack.Navigator>
  );
};

const getAllNavigationScreens = (
  appRoutes: any,
  initialRouteName: string,
  initialParams: any,
) => {
  return appRoutes.map((appRoute: Route) => {
    return (
      <Stack.Screen
        name={appRoute.name}
        key={appRoute.name}
        component={appRoute.screen}
        options={{...appRoute.options}}
        initialParams={initialRouteName === appRoute.name ? initialParams : {}}
      />
    );
  });
};

export default StackView;
