import React, { useState } from 'react';
import { SocialIcon } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import { useNavigation } from '@react-navigation/native';
import { FacebookApi } from '../../utils/social';
import Loading from '../Loading';

const LoginFacebook = ({ toastRef }) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const login = async () => {
    try {
      await Facebook.initializeAsync(FacebookApi.application_id);
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: FacebookApi.permissions,
      });

      if (type === 'success') {
        const credentials = firebase.auth.FacebookAuthProvider.credential(
          token
        );
        setLoading(true);
        firebase
          .auth()
          .signInWithCredential(credentials)
          .then(() => {
            setLoading(false);
            navigation.navigate('account');
          })
          .catch(() => {
            setLoading(false);
            toastRef.current.show('credencials incorrectas');
          });
      } else if (type === 'cancel') {
        toastRef.current.show('cancel');
      }
    } catch (error) {
      toastRef.current.show('error');
    }
  };

  return (
    <>
      <SocialIcon
        title="Iniciar sesión con facebook"
        button
        type="facebook"
        onPress={login}
      />
      <Loading isVisible={loading} text={'Cargando...'} />
    </>
  );
};

export default LoginFacebook;
