import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Rating } from 'react-native-elements';

const RatingRestaurant = ({ name, description, rating }) => {
  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={styles.viewRestaurantContainer}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.ratingRestaurant}
          imageSize={20}
          readonly
          startingValue={rating}
        />
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  );
};

export default RatingRestaurant;

const styles = StyleSheet.create({
  descriptionRestaurant: { marginTop: 5, color: 'grey' },
  nameRestaurant: { fontSize: 20, fontWeight: 'bold' },
  ratingRestaurant: {
    position: 'absolute',
    right: 0,
  },
  viewRestaurantTitle: {
    padding: 15,
  },
  viewRestaurantContainer: {
    flexDirection: 'row',
  },
});
