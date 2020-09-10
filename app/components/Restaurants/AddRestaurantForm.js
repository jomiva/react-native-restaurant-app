import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Alert,
  Dimensions,
  Text,
} from 'react-native';
import { Input, Icon, Avatar, Image, Button } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { map, size, filter } from 'lodash';
import uuid from 'random-uuid-v4';
import { firebaseApp } from '../../utils/firebase';
// eslint-disable-next-line import/order
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
import Modal from '../Modal';

const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get('window').width;

const AddRestaurantForm = ({ toastRef, setIsLoading, navigation }) => {
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: '',
    direction: '',
    description: '',
  });

  const [imageSelected, setImageSelected] = useState([]);
  const [locationRestaurant, setLocationRestaurant] = useState(null);
  const [isVisibleMap, setIsVisibleMap] = useState(false);

  const addRestaurant = () => {
    if (
      !restaurantInfo.name ||
      !restaurantInfo.direction ||
      !restaurantInfo.description
    ) {
      toastRef.current.show('Todos los campos del formulario con obligatorios');
    } else if (size(imageSelected) === 0) {
      toastRef.current.show('El restaurante debe tener al menos una foto');
    } else if (!locationRestaurant) {
      toastRef.current.show('Debe localizar el restaurante en el mapa');
    } else {
      setIsLoading(true);
      uploadImagesStorage().then((response) => {
        db.collection('restaurants')
          .add({
            name: restaurantInfo.name,
            address: restaurantInfo.direction,
            description: restaurantInfo.description,
            location: locationRestaurant,
            images: response,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: firebase.auth().currentUser.uid,
          })
          .then(() => {
            setIsLoading(false);
            navigation.navigate('restaurants');
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show('Error al guardar el restaurante', 3000);
          });
      });
    }
  };

  const uploadImagesStorage = async () => {
    const ImagesBlob = [];

    await Promise.all(
      map(imageSelected, async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref('restaurants').child(uuid());
        await ref.put(blob).then(async (result) => {
          await firebase
            .storage()
            .ref(`restaurants/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoURL) => {
              ImagesBlob.push(photoURL);
            });
        });
      })
    );

    return ImagesBlob;
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ImageRestaurant imageRestaurant={imageSelected[0]} />
      <FormAdd
        restaurantInfo={restaurantInfo}
        setRestaurantInfo={setRestaurantInfo}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
      />
      <UploadImage
        toastRef={toastRef}
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
      />
      <Button
        title="Crear Restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        toastRef={toastRef}
        setLocationRestaurant={setLocationRestaurant}
      />
    </ScrollView>
  );
};

const FormAdd = ({
  restaurantInfo,
  setRestaurantInfo,
  setIsVisibleMap,
  locationRestaurant,
}) => {
  const onChangeForm = (e, type) => {
    setRestaurantInfo({ ...restaurantInfo, [type]: e.nativeEvent.text });
  };

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={(e) => {
          onChangeForm(e, 'name');
        }}
        defaultValue={restaurantInfo.name}
      />
      <Input
        placeholder="Dirección"
        containerStyle={styles.input}
        onChange={(e) => {
          onChangeForm(e, 'direction');
        }}
        defaultValue={restaurantInfo.direction}
        rightIcon={{
          type: 'material-community',
          name: 'google-maps',
          color: locationRestaurant ? '#00a680' : '#c2c2c2',
          onPress: () => setIsVisibleMap(true),
        }}
      />
      <Input
        placeholder="Descripción"
        multiline={true}
        containerStyle={styles.textArea}
        onChange={(e) => {
          onChangeForm(e, 'description');
        }}
        defaultValue={restaurantInfo.description}
      />
    </View>
  );
};

const ImageRestaurant = ({ imageRestaurant }) => {
  return (
    <View style={styles.viewPhoto}>
      <Image
        source={
          imageRestaurant
            ? { uri: imageRestaurant }
            : require('../../../assets/img/no-image.png')
        }
        style={styles.mainImage}
      />
    </View>
  );
};

const Map = ({
  isVisibleMap,
  setIsVisibleMap,
  toastRef,
  setLocationRestaurant,
}) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );

      const statusPermissions = resultPermissions.permissions.location.status;

      if (statusPermissions !== 'granted') {
        toastRef.current.show(
          'Tienes que aceptar los permisos de localizacion',
          3000
        );
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, [toastRef]);

  const confirmLocation = () => {
    setLocationRestaurant(location);
    toastRef.current.show('Localizacion guardada');
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <>
        {location ? (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onPress={(e) => {
              const { latitude, longitude } = e.nativeEvent.coordinate;
              setLocation({
                latitude,
                longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              });
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
            />
          </MapView>
        ) : (
          <Text>Cargando...</Text>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar"
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
            onPress={confirmLocation}
          />
          <Button
            title="Cancelar"
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
            onPress={() => setIsVisibleMap(false)}
          />
        </View>
      </>
    </Modal>
  );
};

const UploadImage = ({ toastRef, imageSelected, setImageSelected }) => {
  const ImageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (resultPermissions.status === 'denied') {
      toastRef.current.show('Es necesario aceptar los permisos', 3000);
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show('Se ha cancelado la seleccion de imagen', 2000);
      } else {
        setImageSelected([...imageSelected, result.uri]);
      }
    }
  };

  const removeImage = (imageToDelete) => {
    Alert.alert(
      'Eliminar imagen',
      'Estas seguro?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Eliminar',
          onPress: () => {
            const result = filter(
              imageSelected,
              (imageUrl) => imageUrl !== imageToDelete
            );
            setImageSelected(result);
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView horizontal style={styles.viewImages}>
      {size(imageSelected) < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={ImageSelect}
        />
      )}
      {map(imageSelected, (imageRestaurant, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
          onPress={() => removeImage(imageRestaurant)}
        />
      ))}
    </ScrollView>
  );
};

export default AddRestaurantForm;

const styles = StyleSheet.create({
  btnAddRestaurant: {
    backgroundColor: '#00a680',
    margin: 20,
  },
  containerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: '#e3e3e3',
  },
  input: { marginBottom: 10 },
  scrollView: {
    height: '100%',
  },
  mainImage: { width: widthScreen, height: 200 },
  mapStyle: { width: '100%', height: 550 },
  miniatureStyle: { width: 70, height: 70, marginRight: 10 },
  textArea: { height: 50, width: '100%', padding: 10, margin: 0 },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
    paddingTop: 25,
  },
  viewImages: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
    paddingBottom: 10,
  },
  viewMapBtn: { flexDirection: 'row', justifyContent: 'center', marginTop: 10 },
  viewMapBtnCancel: {
    backgroundColor: 'red',
  },
  viewMapBtnContainerCancel: { paddingLeft: 5 },
  viewMapBtnContainerSave: { paddingRight: 5 },
  viewMapBtnSave: { backgroundColor: '#00a680' },
  viewPhoto: {
    alignItems: 'center',
    height: 200,
    marginBottom: 20,
  },
});
