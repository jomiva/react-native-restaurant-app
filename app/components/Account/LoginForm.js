import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import { isEmpty } from 'lodash';
import { isEmail } from '../../utils/validations';
import Loading from '../Loading';

const LoginForm = ({ toastRef }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(defaultFormValue());
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  const onSubmit = () => {
    if (isEmpty(formData.email) || isEmpty(formData.password)) {
      toastRef.current.show('Todos los campos son obligatorios');
    } else if (!isEmail(formData.email)) {
      toastRef.current.show('El email no es correcto');
    } else {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(formData.email, formData.password)
        .then(() => {
          setLoading(false);
          navigation.navigate('account');
        })
        .catch(() => {
          setLoading(false);
          toastRef.current.show('Email o contraseña incorrecta');
        });
    }
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Correo electronico"
        onChange={(e) => onChange(e, 'email')}
        containerStyle={styles.inputForm}
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
        onChange={(e) => onChange(e, 'password')}
        password={true}
        secureTextEntry={!showPassword}
        containerStyle={styles.inputForm}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            iconStyle={styles.iconRight}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <Button
        title="Iniciar sesión"
        containerStyle={styles.btnContainerLogin}
        buttonStyle={styles.btnLogin}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text={'Cargando...'} />
    </View>
  );
};

export default LoginForm;

const defaultFormValue = () => {
  return { email: '', password: '' };
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
  btnContainerLogin: {
    marginTop: 20,
    width: '95%',
  },
  btnLogin: { backgroundColor: '#00a680' },
  iconRight: {
    color: '#c1c1c1',
  },
});
