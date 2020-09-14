import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input, AirbnbRating } from 'react-native-elements';

const AddReviewRestaurant = ({ navigation, route }) => {
  const { idRestaurant } = route.params;
  const [state, setstate] = useState();
  return (
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={['Pésimo', 'Deficiente', 'Normal', 'Muy bueno', 'Excelente']}
        />
      </View>
    </View>
  );
};

export default AddReviewRestaurant;

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewRating: {
    height: 110,
    backgroundColor: '#f2f2f2',
  },
});
