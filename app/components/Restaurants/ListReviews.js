import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Avatar, Rating } from 'react-native-elements';
import firebase from 'firebase/app';
import { firebaseApp } from '../../utils/firebase';

const db = firebase.firestore(firebaseApp);

const ListReviews = ({ navigation, idRestaurant, setRating }) => {
  const [userLogged, setUserLogged] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  return (
    <View>
      {userLogged ? (
        <Button
          title="Escribe una opinion"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          icon={{
            type: 'material-community',
            name: 'square-edit-outline',
            color: '#00a680',
          }}
          onPress={() => {
            navigation.navigate('add-review-restaurant', {
              idRestaurant,
            });
          }}
        />
      ) : (
        <View>
          <Text
            style={styles.noLoggedText}
            onPress={() => {
              navigation.navigate('account', { screen: 'login' });
            }}
          >
            No puede comentar si no está logeado
          </Text>
          <Text
            style={styles.noLoggedBtn}
            onPress={() => {
              navigation.navigate('account', { screen: 'login' });
            }}
          >
            Presiona AQUÍ para iniciar sesión
          </Text>
        </View>
      )}
    </View>
  );
};

export default ListReviews;

const styles = StyleSheet.create({
  noLoggedBtn: {
    color: '#00a680',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 30,
  },
  noLoggedText: {
    textAlign: 'center',
    color: '#00a680',
    padding: 20,
    paddingBottom: 10,
  },
  btnAddReview: {
    backgroundColor: 'transparent',
  },
  btnTitleAddReview: {
    color: '#00a680',
  },
});
