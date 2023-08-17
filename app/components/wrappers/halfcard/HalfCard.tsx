import React from 'react';

// @ts-ignore
import Modal from 'react-native-modal';
import ModalBaseScene from './ModalBase';
import DefaultModalContent from './DefaultContent';

class HalfCard extends ModalBaseScene {
  renderModal(): React.ReactElement<any> {
    return (
      <Modal
        testID={'modal'}
        isVisible={this.isVisible()}
        onBackdropPress={this.close}>
        <DefaultModalContent onPress={this.close} />
      </Modal>
    );
  }
}

export default HalfCard;
