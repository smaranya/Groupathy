import {Button} from '../../components/molecules/Button';
import {Colors, getColor} from '../../styles/colors';
import {getSpace, Spaces} from '../../styles/spaces';
import React, {PureComponent} from 'react';
import {Dimensions, StyleSheet, TextInput, View} from 'react-native';
import {FontStyles, getName} from '../../styles/fonts/names';
import {getSize, Sizes} from '../../styles/fonts/sizes';
import {TextView} from '../../components/atoms/TextView';
import AutoSuggest from '../../components/compounds/AutoSuggest';
import {Organization} from './api/Models';
import {checkValidPincode} from '../../utils';

const defaultState = {
  inputData: [] as Array<string>,
  pinCode: '',
  buttonDisable: true,
  pincodeErrorText: '',
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: getColor({color: Colors.white}),
  },
  sscontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: getSpace(Spaces.xxxLarge),
  },
  titleText: {
    textAlign: 'center',
    marginHorizontal: getSpace(Spaces.large),
    paddingTop: getSpace(Spaces.large),
  },
  infoText: {
    marginHorizontal: getSpace(Spaces.small),
    paddingTop: getSpace(Spaces.large),
  },
  errorText: {
    marginHorizontal: getSpace(Spaces.small),
  },
  buttonStyle: {
    alignSelf: 'center',
    flex: 0.5,
    borderRadius: 30,
    paddingVertical: getSpace(Spaces.small),
    backgroundColor: getColor({color: Colors.buttonFill, opacity: 100}),
    marginHorizontal: getSpace(Spaces.small),
  },
  buttonDisabledStyle: {
    alignSelf: 'center',
    flex: 0.5,
    borderRadius: 30,
    paddingVertical: getSpace(Spaces.small),
    backgroundColor: getColor({color: Colors.secondaryColor, opacity: 40}),
    marginHorizontal: getSpace(Spaces.small),
  },
  shimImage: {
    position: 'absolute',
    flex: 1,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: getColor({color: Colors.primaryColor, opacity: 10}),
  },
  formView: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
  },
  pinCodeInput: {
    paddingVertical: getSpace(Spaces.small),
    paddingHorizontal: getSpace(Spaces.small),
    marginHorizontal: getSpace(Spaces.xSmall),
    backgroundColor: getColor({color: Colors.white}),
    marginTop: getSpace(Spaces.medium),
    fontFamily: getName(FontStyles.regular),
    fontSize: getSize(Sizes.large),
    color: getColor({color: Colors.secondaryColor}),
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 4,
    borderColor: getColor({color: Colors.secondaryColor, opacity: 40}),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: getSpace(Spaces.large),
  },
  autoSuggestStyle: {
    position: 'absolute',
  },
});

export type State = Partial<typeof defaultState>;

export type UserInputCardProps = {
  organizations: Array<Organization>;
  onSaveUserData: {(organization: string, pincode: string): void};
  onClose: {(): void};
  onVisible?: {(): void};
};

const convertToAutoSuggestData = (
  organizations: Array<Organization>,
): Array<string> => {
  let data = [] as Array<string>;
  if (organizations && organizations.length > 0) {
    organizations.map((organization) => {
      if (organization.name) {
        data.push(organization.name);
      }
    });
  }
  return data;
};

class UserInputCard extends PureComponent<UserInputCardProps, State> {
  organization = '';
  state = defaultState;

  onOptionSlected = (organization: string) => {
    this.organization = organization;
    if (organization) {
      this.state.buttonDisable && this.setState({buttonDisable: false});
    } else if (!this.state.pinCode) {
      this.setState({buttonDisable: true});
    }
  };

  componentDidMount() {
    this.props.onVisible && this.props.onVisible();
    const autoSuggestInputData = convertToAutoSuggestData(
      this.props.organizations,
    );
    this.setState({inputData: autoSuggestInputData});
  }

  renderChooseOrganization = (width: number) => {
    return (
      <AutoSuggest
        data={this.state.inputData}
        containerWidth={width}
        containerStyle={styles.autoSuggestStyle}
        onOptionSelected={this.onOptionSlected}
        placeholder={'Search your Organization'}
      />
    );
  };

  onUserSave = () => {
    if (this.state.pinCode) {
      if (!checkValidPincode(this.state.pinCode)) {
        this.setState({pincodeErrorText: '* Please enter valid pincode'});
        return;
      }
    }
    this.props.onSaveUserData &&
      this.props.onSaveUserData(
        this.organization || '',
        this.state.pinCode || '',
      );
  };

  handleTextChange = (newText: string) => {
    this.setState({pinCode: newText});
    if (this.state.pincodeErrorText) {
      this.setState({pincodeErrorText: ''});
    }
    if (newText) {
      this.state.buttonDisable && this.setState({buttonDisable: false});
    } else {
      !this.organization && this.setState({buttonDisable: true});
    }
  };

  onClose = () => {
    this.props.onClose && this.props.onClose();
  };

  render() {
    const width =
      Dimensions.get('window').width - 2 * getSpace(Spaces.subMedium);
    const containerStyle = [styles.container, {width}];

    return (
      <View style={[styles.container, containerStyle]}>
        <TextView
          fontFamily={FontStyles.bold}
          textColor={{color: Colors.secondaryColor, opacity: 100}}
          fontSize={Sizes.largePlus}
          style={styles.titleText}>
          {'Before You Begin'}
        </TextView>
        <TextView
          fontFamily={FontStyles.medium}
          fontSize={Sizes.large}
          textColor={{color: Colors.secondaryColor, opacity: 80}}
          style={styles.infoText}>
          {'Please provide the following details for personalization'}
        </TextView>
        <View>
          {this.renderChooseOrganization(width)}

          <TextInput
            style={[
              styles.pinCodeInput,
              {width: width - getSpace(Spaces.large) / 2},
            ]}
            value={this.state.pinCode}
            maxLength={6}
            //autoCompleteType={'postal-code'}
            keyboardType={'numeric'}
            placeholder={'Please enter your pincode'}
            onChangeText={this.handleTextChange}
          />
          <TextView
            fontFamily={FontStyles.bold}
            fontSize={Sizes.xSmall}
            textColor={{color: Colors.error, opacity: 100}}
            style={styles.errorText}>
            {this.state.pincodeErrorText}
          </TextView>
          <TextView
            fontFamily={FontStyles.italicMedium}
            fontSize={Sizes.medium}
            textColor={{color: Colors.secondaryColor, opacity: 60}}
            style={styles.infoText}>
            {
              '* Please Note:  We do not access or publish any individual information. Please feel assured while provoding details. You can always check our privacy policy, in case of any doubts.'
            }
          </TextView>
          <View style={styles.buttonContainer}>
            <Button
              style={[styles.buttonStyle]}
              touchableProps={{
                touchable: 'highLight',
                onPress: this.onClose,
              }}
              textProps={{
                textColor: {color: Colors.white},
                fontFamily: FontStyles.bold,
                fontSize: Sizes.large,
              }}
              text={'SKIP'}
            />
            <Button
              style={[styles.buttonStyle]}
              touchableProps={{
                touchable: 'highLight',
                onPress: this.onUserSave,
                disabled: this.state.buttonDisable,
              }}
              textProps={{
                textColor: {color: Colors.white},
                fontFamily: FontStyles.bold,
                fontSize: Sizes.large,
              }}
              disabledStyle={[styles.buttonDisabledStyle]}
              text={'SUBMIT'}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default UserInputCard;