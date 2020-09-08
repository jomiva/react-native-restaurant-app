import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';

const ChangeDisplayNameForm = ({
  displayName,
  setIsVisible,
  toastRef,
  setReloadUserInfo,
}) => {
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setError(null);
    if (!newDisplayName) {
      setError('El nombre no puede estar vacío');
    } else if (displayName === newDisplayName) {
      setError('El nombre no puede ser igual al anterior');
    } else {
      setIsLoading(true);
      const update = { displayName: newDisplayName };
      firebase
        .auth()
        .currentUser.updateProfile(update)
        .then(() => {
          setIsLoading(false);
          setReloadUserInfo(true);
          setIsVisible(false);
          toastRef.current.show('Nombre actualizado');
        })
        .catch(() => {
          setIsLoading(false);
          setError('Error al actualizar el nombre');
        });
    }
  };

  return (
    <View style={styles.view}>
      <Input
        defaultValue={displayName || ''}
        placeholder="Nombre y Apellidos"
        containerStyle={styles.input}
        rightIcon={{
          type: 'material-community',
          name: 'account-circle-outline',
          color: '#c2c2c2',
        }}
        onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
        errorMessage={error}
      />
      <Button
        title="Cambiar nombre"
        buttonStyle={styles.btn}
        containerStyle={styles.btnContainer}
        onPress={onSubmit}
        loading={isLoading}
      />
    </View>
  );
};

export default ChangeDisplayNameForm;

const styles = StyleSheet.create({
  btn: { backgroundColor: '#00a680' },
  btnContainer: { marginTop: 5, width: '95%' },
  input: {
    marginBottom: 5,
  },
  view: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
  },
});
