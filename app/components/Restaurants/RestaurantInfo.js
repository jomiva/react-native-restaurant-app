import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { map } from 'lodash';
import { Icon, ListItem } from 'react-native-elements';
import MapRestaurant from '../MapRestaurant';

const RestaurantInfo = ({ location, name, address }) => {
  const listInfo = [
    {
      text: address,
      iconName: 'map-marker',
      iconType: 'material-community',
      action: null,
    },
    {
      text: '+58 666 555 44',
      iconName: 'phone',
      iconType: 'material-community',
      action: null,
    },
    {
      text: 'restaurant@gmail.com',
      iconName: 'at',
      iconType: 'material-community',
      action: null,
    },
  ];

  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Informacion sobre el restaurante
      </Text>
      <MapRestaurant location={location} name={name} height={150} />
      {map(listInfo, (item, index) => (
        <ListItem key={index} containerStyle={styles.containerListItem}>
          <Icon name={item.iconName} type={item.iconType} color={'#00a680'} />
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
};

export default RestaurantInfo;

const styles = StyleSheet.create({
  containerListItem: { borderBottomColor: '#d8d8d8', borderBottomWidth: 1 },
  restaurantInfoTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25,
  },
});
