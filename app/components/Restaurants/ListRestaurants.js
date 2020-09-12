import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Image } from 'react-native-elements';
import { size } from 'lodash';
import { useNavigation } from '@react-navigation/native';

const ListRestaurants = ({ restaurants, handleLoadMore, isLoading }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.viewListRestaurantsContainer}>
      {size(restaurants) ? (
        <FlatList
          data={restaurants}
          renderItem={(restaurant) => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReachedThreshold={0.1}
          onEndReached={handleLoadMore}
          ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View style={styles.loaderRestaurant}>
          <ActivityIndicator size="large" />
          <Text>Cargando Restaurantes...</Text>
        </View>
      )}
    </View>
  );
};

export default ListRestaurants;

const Restaurant = ({ restaurant, navigation }) => {
  const { id, images, name, address, description } = restaurant.item;
  const imageRestaurant = images[0];

  const goRestaurant = () => {
    navigation.navigate('restaurant', { id, name });
  };

  return (
    <TouchableOpacity onPress={goRestaurant}>
      <View style={styles.viewRestaurant}>
        <View style={styles.viewRestaurantImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator size="large" color="fff" />}
            source={
              imageRestaurant
                ? { uri: imageRestaurant }
                : require('../../../assets/img/no-image.png')
            }
            style={styles.imageRestaurant}
          />
        </View>
        <View>
          <Text style={styles.restaurantName}>{name}</Text>
          <Text style={styles.restaurantAddress}>{address}</Text>
          <Text style={styles.restaurantDescription}>
            {`${description.substr(0, 60)}...`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FooterList = ({ isLoading }) => {
  return isLoading ? (
    <View style={styles.loaderRestaurant}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={styles.notFoundRestaurants}>
      <Text>No quedan restaurantes por cargar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageRestaurant: { width: 80, height: 80 },
  loaderRestaurant: { marginTop: 10, marginBottom: 10, alignItems: 'center' },
  notFoundRestaurants: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  viewRestaurant: {
    flexDirection: 'row',
    margin: 15,
  },
  viewRestaurantImage: {
    marginRight: 15,
  },
  restaurantAddress: {
    paddingTop: 2,
    color: 'grey',
  },
  restaurantDescription: {
    paddingTop: 2,
    color: 'grey',
  },
  restaurantName: {
    fontWeight: 'bold',
  },
});
