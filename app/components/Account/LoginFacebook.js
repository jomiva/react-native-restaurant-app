import React from 'react';
import { SocialIcon } from 'react-native-elements';

const LoginFacebook = () => {
  const login = () => {
    console.log('login');
  };

  return (
    <SocialIcon
      title="Iniciar sesión con facebook"
      button
      type="facebook"
      onPress={login}
    />
  );
};

export default LoginFacebook;
