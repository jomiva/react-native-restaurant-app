import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon } from 'react-native-elements';
import firebase from 'firebase/app';
import { useNavigation } from '@react-navigation/native';
import { firebaseApp } from '../../utils/firebase';

const Restaurants = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  return (
    <View style={styles.viewBody}>
      <Text>Restaurants...</Text>
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
