import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';
import firebase from 'firebase/app';
import Loading from '../../components/Loading';
import 'firebase/firestore';
import { firebaseApp } from '../../utils/firebase';
import ImagesCarousel from '../../components/ImagesCarousel';
import RatingRestaurant from '../../components/Restaurants/RatingRestaurant';
import RestaurantInfo from '../../components/Restaurants/RestaurantInfo';

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get('window').width;

const Restaurant = ({ navigation, route }) => {
  const { id, name } = route.params;
  navigation.setOptions({ title: name });

  const [restaurant, setRestaurant] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    db.collection('restaurants')
      .doc(id)
      .get()
      .then((response) => {
        const data = response.data();
        data.id = id;
        setRestaurant(data);
        setRating(parseFloat(data.rating));
      });
  }, [id]);

  if (!restaurant) return <Loading isVisible={true} text="Cargando..." />;

  return (
    <ScrollView vertical style={styles.viewBody}>
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
    </ScrollView>
  );
};

export default Restaurant;

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
