import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import Modal, {ModalProps} from 'react-native-modal';

const defaultStates = {
  isVisible: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export type State = Partial<typeof defaultStates>;

export type HalfCardProps = {
  onDismiss?: {(): void};
  onVisible?: {(): void};
} & Partial<ModalProps>;

class HalfCard extends PureComponent<HalfCardProps, State> {
  isMounted = false;
  state = defaultStates;
  componentDidMount() {
    this.isMounted = true;
  }

  componentWillUnmount() {
    this.isMounted = false;
  }

  show = () => {
    this.isMounted && this.setState({isVisible: true}, this.onDismiss);
  };

  hide = () => {
    this.isMounted && this.setState({isVisible: false}, this.onDismiss);
  };

  onDismiss = () => {
    this.props.onDismiss && this.props.onDismiss();
  };

  onVisible = () => {
    this.props.onVisible && this.props.onVisible();
  };

  render() {
    return (
      <View style={styles.container}>
        <Modal onDismiss={this.onDismiss} isVisible={this.state.isVisible}>
          {this.props.children}
        </Modal>
      </View>
    );
  }
}

export default HalfCard;
