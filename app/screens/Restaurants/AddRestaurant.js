import React, { useRef, useState } from 'react';
import { View } from 'react-native';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';
import AddRestaurantForm from '../../components/Restaurants/AddRestaurantForm';

const AddRestaurant = ({ navigation }) => {
  const toastRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View>
      <AddRestaurantForm
        toastRef={toastRef}
        navigation={navigation}
        setIsLoading={setIsLoading}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Creando Restaurante..." />
    </View>
  );
};

export default AddRestaurant;
