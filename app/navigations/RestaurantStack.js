import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Restaurants from '../screens/Restaurants/Restaurants';
import AddRestaurant from '../screens/Restaurants/AddRestaurant';
import Restaurant from '../screens/Restaurants/Restaurant';

const Stack = createStackNavigator();

const RestaurantStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="restaurants"
        component={Restaurants}
        options={{ title: 'Restaurantes' }}
      />
      <Stack.Screen
        name="add-restaurants"
        component={AddRestaurant}
        options={{ title: 'Añadir Restaurante' }}
      />
      <Stack.Screen name="restaurant" component={Restaurant} />
    </Stack.Navigator>
  );
};

export default RestaurantStack;
