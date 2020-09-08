import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar, Accessory } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

const InfoUser = ({ userInfo, toastRef, setLoading, setLoadingText }) => {
  const { photoURL, displayName, email, uid } = userInfo;

  const changeAvatar = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;
    if (resultPermissionCamera === 'denied') {
      toastRef.current.show(
        'Es obligatorio aceptar los permisos de la galeria'
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (result.cancelled) {
        toastRef.current.show('Se ha cancelado la seleccion de imagenes');
      } else {
        uploadImage(result.uri)
          .then(() => {
            updatePhotoUri();
          })
          .catch(() => {
            toastRef.current.show('error al actualizar imagen');
          });
      }
    }
  };

  const uploadImage = async (uri) => {
    setLoadingText('Cargando nueva imagen...');
    setLoading(true);
    const res = await fetch(uri);
    const blob = await res.blob();
    const ref = firebase.storage().ref().child(`avatar/${uid}`);
    return ref.put(blob);
  };

  const updatePhotoUri = () => {
    firebase
      .storage()
      .ref(`avatar/${uid}`)
      .getDownloadURL()
      .then(async (response) => {
        const update = {
          photoURL: response,
        };
        await firebase.auth().currentUser.updateProfile(update);
        setLoading(false);
      })
      .catch(() => {
        toastRef.current.show('error al actualizar la imagen');
      });
  };

  return (
    <View style={styles.viewUserInfo}>
      <Avatar
        rounded
        size="large"
        containerStyle={styles.userInfoAvatar}
        source={
          photoURL
            ? { uri: photoURL }
            : require('../../../assets/img/avatar-default.jpg')
        }
      >
        <Accessory onPress={changeAvatar} size={25} />
      </Avatar>
      <View>
        <Text style={styles.displayName}>{displayName || 'Anonimo'}</Text>
        <Text>{email || 'Social Login'}</Text>
      </View>
    </View>
  );
};

export default InfoUser;

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    paddingTop: 30,
    paddingBottom: 30,
  },
  userInfoAvatar: {
    marginRight: 20,
    backgroundColor: '#00a680',
    fontSize: 20,
  },
  displayName: {
    fontWeight: 'bold',
    paddingBottom: 5,
  },
});
