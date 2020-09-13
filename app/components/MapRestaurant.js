/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import openMap from 'react-native-open-maps';

const MapRestaurant = ({ location, name, height }) => {
  const openAppMap = () => {
    openMap({
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 19,
      query: name,
    });
  };

  return (
    <MapView
      onPress={openAppMap}
      style={{ height, width: '100%' }}
      initialRegion={location}
    >
      <MapView.Marker
        onPress={openAppMap}
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
      />
    </MapView>
  );
};

export default MapRestaurant;

const styles = StyleSheet.create({
  viewContainer: {
    marginBottom: 3,
  },
});
