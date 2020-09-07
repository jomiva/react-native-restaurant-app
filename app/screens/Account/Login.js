import React, { useRef } from 'react';
import { StyleSheet, ScrollView, Text, View, Image } from 'react-native';
import { Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import LoginForm from '../../components/Account/LoginForm';
import LoginFacebook from '../../components/Account/LoginFacebook';

const Login = () => {
  const toastRef = useRef();
  return (
    <ScrollView>
      <Image
        source={require('../../../assets/img/5-tenedores-letras-icono-logo.png')}
        resizeMode="contain"
        style={styles.logo}
      />
      <View style={styles.viewContainer}>
        <LoginForm toastRef={toastRef} />
        <CreateAccount />
      </View>
      <Divider style={styles.divider} />
      <View>
        <LoginFacebook />
      </View>
      <Toast
        useNativeDriver={true}
        ref={toastRef}
        position={'center'}
        opacity={0.9}
      />
    </ScrollView>
  );
};

const CreateAccount = () => {
  const navigation = useNavigation();
  return (
    <>
      {/* <Text style={styles.textRegister}>Aun no tienes una cuenta?</Text> */}
      <Text
        style={styles.btnRegister}
        onPress={() => navigation.navigate('register')}
      >
        Registrarse
      </Text>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  logo: {
    width: '100%',
    height: 150,
    marginTop: 20,
  },
  viewContainer: {
    marginRight: 40,
    marginLeft: 40,
  },
  btnRegister: {
    color: '#00a680',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  divider: {
    backgroundColor: '#00a680',
    margin: 15,
  },
});
