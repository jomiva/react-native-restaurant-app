import React from 'react';
import { View, Text, Button } from 'react-native';
import firebase from 'firebase';

const UserLogged = () => {
  return (
    <View>
      <Text>UserLogged...</Text>
      <Button
        title="Cerrar sesión"
        onPress={() => {
          firebase.auth().signOut();
        }}
      />
    </View>
  );
};

export default UserLogged;
