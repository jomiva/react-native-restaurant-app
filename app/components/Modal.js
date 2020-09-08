import React from 'react';
import { StyleSheet } from 'react-native';
import { Overlay } from 'react-native-elements';

const Modal = ({ isVisible, setIsVisible, children }) => {
  const closeModal = () => setIsVisible(false);

  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(0,0,0,0.5)"
      overlayStyle={styles.overlayStyle}
      backdropStyle={styles.backdropStyle}
      onBackdropPress={closeModal}
    >
      {children}
    </Overlay>
  );
};

export default Modal;

const styles = StyleSheet.create({
  backdropStyle: { backgroundColor: 'rgba(0,0,0,0.5)' },
  overlayStyle: {
    backgroundColor: '#fff',
    height: 'auto',
    width: '90%',
  },
});
