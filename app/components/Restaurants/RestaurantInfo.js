import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import MapRestaurant from '../MapRestaurant';

const RestaurantInfo = ({ location, name, address }) => {
  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Informacion sobre el restaurante
      </Text>
      <MapRestaurant location={location} name={name} height={150} />
    </View>
  );
};

export default RestaurantInfo;

const styles = StyleSheet.create({
  restaurantInfoTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25,
  },
});
