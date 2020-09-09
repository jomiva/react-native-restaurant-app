import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { reAuthtenticate } from '../../utils/api';

const ChangePasswordForm = ({ setIsVisible, toastRef, setReloadUserInfo }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [formData, setFormData] = useState(defaultValues());
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onChangeInput = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = () => {
    setErrors({});
    if (!formData.password) {
      setErrors({ password: 'La contraseña es obligatoria' });
    } else if (!formData.newPassword) {
      setErrors({ newPassword: 'La nueva contraseña es obligatoria' });
    } else if (!formData.confirmNewPassword) {
      setErrors({
        confirmNewPassword: 'La confirmacion de la contraseña es obligatoria',
      });
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      setErrors({
        confirmNewPassword: 'La confirmacion de contraseña no coincide',
      });
    } else if (formData.password === formData.newPassword) {
      setErrors({
        newPassword:
          'La nueva contraseña no puede ser igual a la contraseña anterior',
      });
    } else {
      setIsLoading(true);
      reAuthtenticate(formData.password)
        .then(() => {
          firebase
            .auth()
            .currentUser.updatePassword(formData.newPassword)
            .then(() => {
              setIsLoading(false);
              setReloadUserInfo(true);
              toastRef.current.show(
                'La contraseña ha sido actualizada. Redireccionando...'
              );
              setIsVisible(false);
              setTimeout(() => {
                firebase.auth().signOut();
              }, 3000);
            })
            .catch(() => {
              toastRef.current.show('No se puso actualizar la contraseña');
              setIsLoading(false);
            });
        })
        .catch(() => {
          setIsLoading(false);
          setErrors({ password: 'La contraseña no es correcta' });
        });
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showPassword}
        onChange={(e) => onChangeInput(e, 'password')}
        rightIcon={{
          type: 'material-community',
          name: showPassword ? 'eye-off-outline' : 'eye-outline',
          color: '#c2c2c2',
          onPress: () => setShowPassword(!showPassword),
        }}
        errorMessage={errors.password}
      />
      <Input
        placeholder="Nueva Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showNewPassword}
        onChange={(e) => onChangeInput(e, 'newPassword')}
        rightIcon={{
          type: 'material-community',
          name: showNewPassword ? 'eye-off-outline' : 'eye-outline',
          color: '#c2c2c2',
          onPress: () => setShowNewPassword(!showNewPassword),
        }}
        errorMessage={errors.newPassword}
      />
      <Input
        placeholder="Confirmar Nueva Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showConfirmNewPassword}
        onChange={(e) => onChangeInput(e, 'confirmNewPassword')}
        rightIcon={{
          type: 'material-community',
          name: showConfirmNewPassword ? 'eye-off-outline' : 'eye-outline',
          color: '#c2c2c2',
          onPress: () => setShowConfirmNewPassword(!showConfirmNewPassword),
        }}
        errorMessage={errors.confirmNewPassword}
      />
      <Button
        title="Cambiar contraseña"
        buttonStyle={styles.btn}
        containerStyle={styles.btnContainer}
        onPress={onSubmit}
        loading={isLoading}
      />
    </View>
  );
};

export default ChangePasswordForm;

const defaultValues = () => ({
  password: '',
  newPassword: '',
  confirmNewPassword: '',
});

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
