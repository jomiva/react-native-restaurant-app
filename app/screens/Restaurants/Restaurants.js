import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { firebaseApp } from '../../utils/firebase';
import ListRestaurants from '../../components/Restaurants/ListRestaurants';

const db = firebase.firestore(firebaseApp);

const Restaurants = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  const [restaurants, setRestaurants] = useState([]);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [startRestaurant, setStartRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const limitRestaurants = 7;

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      db.collection('restaurants')
        .get()
        .then((snap) => {
          setTotalRestaurants(snap.size);
        })
        .catch(() => {});

      const resultResturants = [];
      db.collection('restaurants')
        .orderBy('createAt', 'desc')
        .limit(limitRestaurants)
        .get()
        .then((response) => {
          setStartRestaurant(response.docs[response.docs.length - 1]);
          response.forEach((doc) => {
            const restaurant = doc.data();
            restaurant.id = doc.id;
            resultResturants.push(restaurant);
          });
          setRestaurants(resultResturants);
        })
        .catch(() => {});
    }, [])
  );

  const handleLoadMore = () => {
    const resultRestaurants = [];
    restaurants.length < totalRestaurants && setIsLoading(true);
    db.collection('restaurants')
      .orderBy('createAt', 'desc')
      .startAfter(startRestaurant.data().createAt)
      .limit(limitRestaurants)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartRestaurant(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }
        response.forEach((doc) => {
          const restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurants.push(restaurant);
        });
        setRestaurants([...restaurants, ...resultRestaurants]);
      });
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
        restaurants={restaurants}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
      />
      {user && (
        <Icon
          type="material-community"
          name="plus"
          color="#00a680"
          reverse
          containerStyle={styles.btnContainer}
          onPress={() => {
            navigation.navigate('add-restaurants');
          }}
        />
      )}
    </View>
  );
};

export default Restaurants;

const styles = StyleSheet.create({
  btnContainer: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
  viewBody: { flex: 1, backgroundColor: '#fff' },
});
