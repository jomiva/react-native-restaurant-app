import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Dimensions, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import { Icon } from 'react-native-elements';
import firebase from 'firebase/app';
import Loading from '../../components/Loading';
import 'firebase/firestore';
import { firebaseApp } from '../../utils/firebase';
import ImagesCarousel from '../../components/ImagesCarousel';
import RatingRestaurant from '../../components/Restaurants/RatingRestaurant';
import RestaurantInfo from '../../components/Restaurants/RestaurantInfo';
import ListReviews from '../../components/Restaurants/ListReviews';

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get('window').width;

const Restaurant = ({ navigation, route }) => {
  const { id, name } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const toastRef = useRef();
  navigation.setOptions({ title: name });

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  useFocusEffect(
    useCallback(() => {
      db.collection('restaurants')
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = id;
          setRestaurant(data);
          setRating(parseFloat(data.rating));
        });
    }, [id])
  );

  useEffect(() => {
    if (userLogged && restaurant) {
      db.collection('favorites')
        .where('idRestaurant', '==', restaurant.id)
        .where('idUser', '==', firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length) {
            setIsFavorite(true);
          }
        });
    }
  }, [userLogged, restaurant]);

  const addFavorite = () => {
    if (!userLogged) {
      toastRef.current.show('Debes iniciar sesión');
    } else {
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idRestaurant: restaurant.id,
      };
      db.collection('favorites')
        .add(payload)
        .then(() => {
          setIsFavorite(true);
          toastRef.current.show('Restaurante añadido a favoritos');
        })
        .catch(() => {
          toastRef.current.show('Error al añadir el restaurante a favoritos');
        });
    }
  };

  const removeFavorite = () => {
    db.collection('favorites')
      .where('idRestaurant', '==', restaurant.id)
      .where('idUser', '==', firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection('favorites')
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show(
                'restaurante eliminado de la lista de favoritos'
              );
            })
            .catch(() => {
              toastRef.current.show(
                'error al eliminar el restaurante de favoritos'
              );
            });
        });
      });
  };

  if (!restaurant) return <Loading isVisible={true} text="Cargando..." />;

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewFavorites}>
        <Icon
          type="material-community"
          name={isFavorite ? 'heart' : 'heart-outline'}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? '#f00' : '#000'}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <ImagesCarousel
        arrayImages={restaurant.images}
        height={250}
        width={screenWidth}
      />
      <RatingRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={rating}
      />
      <RestaurantInfo
        location={restaurant.location}
        name={restaurant.name}
        address={restaurant.address}
      />
      <ListReviews navigation={navigation} idRestaurant={restaurant.id} />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewFavorites: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 100,
    paddingTop: 5,
    paddingLeft: 15,
  },
});
