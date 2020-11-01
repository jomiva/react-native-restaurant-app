/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { SearchBar, ListItem, Avatar } from 'react-native-elements';
import { FireSQL } from 'firesql';
import 'firebase/firestore';
import firebase from 'firebase/app';

const fireSQL = new FireSQL(firebase.firestore(), { includeId: 'id' });

const Search = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (search) {
      fireSQL
        .query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
        .then((response) => {
          setRestaurants(response);
        });
    }
  }, [search]);

  return (
    <View>
      <SearchBar
        placeholder="Busca tu restaurante..."
        onChangeText={(e) => {
          setSearch(e);
        }}
        value={search}
        containerStyle={styles.searchBar}
      />
      {restaurants?.length === 0 ? (
        <NotFoundRestaurants />
      ) : (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
};

const NotFoundRestaurants = () => {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image
        source={require('../../assets/img/no-result-found.png')}
        resizeMode="cover"
        style={{ width: 200, height: 200 }}
      />
    </View>
  );
};

const Restaurant = ({ navigation, restaurant }) => {
  const { id, name, images } = restaurant.item;
  return (
    <ListItem
      onPress={() => {
        navigation.navigate('restaurants', {
          screen: 'restaurant',
          params: { id, name },
        });
      }}
    >
      <Avatar
        source={
          images[0]
            ? { uri: images[0] }
            : require('../../assets/img/no-image.png')
        }
      />
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
      </ListItem.Content>
      <ListItem.Chevron color="#000" />
    </ListItem>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchBar: { marginBottom: 20 },
});
