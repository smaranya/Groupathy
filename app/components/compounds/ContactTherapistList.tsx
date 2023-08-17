import React, {PureComponent} from 'react';
import ContactTherapistView, {
  TherapistData,
} from '../molecules/ContactTherapist';
import {FlatList} from 'react-native-gesture-handler';
import {StyleSheet, View, Dimensions, Alert, Linking} from 'react-native';
import {getColor, Colors} from '../../styles/colors';
import {getSpace, Spaces} from '../../styles/spaces';
import {TextView} from '../atoms/TextView';
import {FontStyles, getName} from '../../styles/fonts/names';
import {Sizes} from '../../styles/fonts/sizes';
import Snackbar from 'react-native-snackbar';

const defaultState = {
  therapistDataList: [] as Array<TherapistData>,
};

export type ContactTherapistListProps = {
  therapistData: Array<TherapistData>;
};

type State = Partial<typeof defaultState>;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e0e0',
    paddingBottom: getSpace(Spaces.subMedium),
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: getSpace(Spaces.xLarge),
    marginBottom: getSpace(Spaces.small),
    marginHorizontal: getSpace(Spaces.large),
  },
  helpText: {
    textAlign: 'center',
    marginBottom: getSpace(Spaces.xSmall),
    letterSpacing: 1,
  },
  helpSubtext: {
    textAlign: 'center',
    marginBottom: getSpace(Spaces.small),
  },
});

class ContactTherapistList extends PureComponent<
  ContactTherapistListProps,
  State
> {
  constructor(props: ContactTherapistListProps) {
    super(props);
    this.state = {
      therapistDataList: props.therapistData,
    };
  }

  makeCall = (phoneNumber: string) => {
    phoneNumber = `tel:${phoneNumber}`;
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneNumber);
          return;
        }
        this.onPhoneNumberOperError();
      })
      .catch(() => this.onPhoneNumberOperError());
  };

  onPhoneNumberOperError = () => {
    Snackbar.show({
      text: 'Please enter a valid pincode',
      fontFamily: getName(FontStyles.regular),
      textColor: getColor({color: Colors.white}),
      backgroundColor: getColor({
        color: Colors.error,
        opacity: 80,
      }),
      duration: Snackbar.LENGTH_LONG,
    });
  };

  onChatNowClicked = (phoneNumber: string) => {
    Alert.alert(
      'Call Therapist',
      'Call will be placed using carrier, click "Yes" to continue.',
      [
        {
          text: 'Yes',
          onPress: () => this.makeCall(phoneNumber),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  renderItem = ({item}: {item: TherapistData}) => {
    return (
      <ContactTherapistView
        therapistData={item}
        onContactButtonClicked={this.onChatNowClicked}
      />
    );
  };

  renderHeader = () => {
    const width = Dimensions.get('window').width - 2 * getSpace(Spaces.large);
    return (
      <View style={styles.headerContainer}>
        <TextView
          style={[styles.helpText, {width: width}]}
          fontFamily={FontStyles.medium}
          fontSize={Sizes.xLarge}
          textColor={{color: Colors.secondaryColor, opacity: 80}}>
          {'NEED HELP ?'}
        </TextView>
        <TextView
          style={[styles.helpSubtext, {width: width}]}
          fontFamily={FontStyles.italicMedium}
          fontSize={Sizes.large}
          textColor={{color: Colors.secondaryColor, opacity: 60}}>
          {'You can reach out to following therapists'}
        </TextView>
      </View>
    );
  };

  render() {
    return (
      <FlatList
        style={styles.container}
        showsVerticalScrollIndicator={false}
        data={this.state.therapistDataList}
        ListHeaderComponent={this.renderHeader}
        renderItem={this.renderItem}
      />
    );
  }
}

export default ContactTherapistList;
