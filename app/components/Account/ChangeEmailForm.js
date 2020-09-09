import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import * as firebase from 'firebase';
import { Input, Button } from 'react-native-elements';
import { isEmail } from '../../utils/validations';
import { reAuthtenticate } from '../../utils/api';

const ChangeEmailForm = ({
  email,
  setIsVisible,
  toastRef,
  setReloadUserInfo,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(defaultValues());
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const onChangeInput = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = () => {
    setErrors({});
    if (!formData.email || email === formData.email) {
      setErrors({ email: 'El email no ha cambiado' });
    } else if (!isEmail(formData.email)) {
      setErrors({ email: 'El email es incorrecto' });
    } else if (!formData.password) {
      setErrors({ password: 'La contraseña es obligatoria' });
    } else {
      setIsLoading(true);
      reAuthtenticate(formData.password)
        .then(() => {
          firebase
            .auth()
            .currentUser.updateEmail(formData.email)
            .then(() => {
              setIsLoading(false);
              setReloadUserInfo(true);
              toastRef.current.show('Email actualizado correctamente');
              setIsVisible(false);
            })
            .catch(() => {
              setErrors({ email: 'El email ya se encuentra en uso' });
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
        defaultValue={email || ''}
        placeholder="Email"
        containerStyle={styles.input}
        rightIcon={{
          type: 'material-community',
          name: 'at',
          color: '#c2c2c2',
        }}
        onChange={(e) => onChangeInput(e, 'email')}
        errorMessage={errors.email}
      />
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
      <Button
        buttonStyle={styles.btn}
        containerStyle={styles.btnContainer}
        loading={isLoading}
        onPress={onSubmit}
        title="Cambiar email"
      />
    </View>
  );
};

export default ChangeEmailForm;

const defaultValues = () => ({ email: '', password: '' });

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
