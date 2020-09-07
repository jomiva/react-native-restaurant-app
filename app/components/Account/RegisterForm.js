import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { size, isEmpty } from 'lodash';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import { isEmail } from '../../utils/validations';
import Loading from '../Loading';

const RegisterForm = ({ toastRef }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const onSubmit = () => {
    if (
      isEmpty(formData.email) ||
      isEmpty(formData.password) ||
      isEmpty(formData.confirmpassword)
    ) {
      toastRef.current.show('todos los campos son obligatorios');
    } else if (!isEmail(formData.email)) {
      toastRef.current.show('Email no valido');
    } else if (formData.password !== formData.confirmpassword) {
      toastRef.current.show('las comtraseñas no coinciden');
    } else if (size(formData.password) < 6) {
      toastRef.current.show(
        'las contraseñas deben tener al menos 6 caracteres'
      );
    } else {
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          setLoading(false);
          navigation.navigate('account');
        })
        .catch(() => {
          setLoading(false);
          toastRef.current.show('El email ya se encuentra en uso');
        });
      toastRef.current.show('ok');
    }
  };

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo electrónico"
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, 'email')}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.iconRight}
          />
        }
      />
      <Input
        placeholder="Contraseña"
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, 'password')}
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Input
        placeholder="Confirmar Contraseña"
        containerStyle={styles.inputForm}
        onChange={(e) => onChange(e, 'confirmpassword')}
        password={true}
        secureTextEntry={!showConfirmPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            iconStyle={styles.iconRight}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
      />
      <Button
        title="Unirse"
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text={'Creando...'} />
    </View>
  );
};

export default RegisterForm;

const defaultFormValue = () => {
  return { email: '', password: '', confirmpassword: '' };
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  inputForm: {
    width: '100%',
    marginTop: 20,
  },
  btnContainerRegister: {
    marginTop: 20,
    width: '95%',
  },
  btnRegister: {
    backgroundColor: '#00a680',
  },
  iconRight: {
    color: '#c1c1c1',
  },
});
