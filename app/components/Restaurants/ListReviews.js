import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Avatar, Rating } from 'react-native-elements';
import { map } from 'lodash';
import firebase from 'firebase/app';
import { firebaseApp } from '../../utils/firebase';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

const ListReviews = ({ navigation, idRestaurant }) => {
  const [userLogged, setUserLogged] = useState(false);
  const [reviews, setReviews] = useState([]);
  console.log(reviews);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useEffect(() => {
    db.collection('reviews')
      .where('idRestaurant', '==', idRestaurant)
      .get()
      .then((response) => {
        const resultReviews = [];
        response.forEach((doc) => {
          const data = doc.data();
          resultReviews.push(data);
        });
        setReviews(resultReviews);
      });
  }, [idRestaurant]);

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
      {map(reviews, (review, index) => (
        <Review key={index} reviewProp={review} />
      ))}
    </View>
  );
};

const Review = ({ reviewProp }) => {
  const { title, review, rating, createAt, avatarUser } = reviewProp;
  const createReview = new Date(createAt.seconds * 1000);

  return (
    <View style={styles.viewReview}>
      <View style={styles.viewImageAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.imageAvatarUser}
          source={
            avatarUser
              ? { uri: avatarUser }
              : require('../../../assets/img/avatar-default.jpg')
          }
        />
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{review}</Text>
        <Rating imageSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewDate}>
          {createReview.getDate()}/{createReview.getMonth() - 1}/
          {createReview.getFullYear()} - {createReview.getHours()}:
          {createReview.getMinutes() < 10 ? '0' : ''}
          {createReview.getMinutes()}
        </Text>
      </View>
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
  imageAvatarUser: {
    width: 50,
    height: 50,
  },
  viewReview: {
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 20,
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
  },
  viewImageAvatar: {
    marginRight: 15,
  },
  viewInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  reviewTitle: {
    fontWeight: 'bold',
  },
  reviewText: {
    paddingTop: 2,
    color: '#e3e3e3',
    marginBottom: 5,
  },
  reviewDate: {
    marginTop: 5,
    color: '#e3e3e3',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});
