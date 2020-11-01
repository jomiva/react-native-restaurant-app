import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Input, AirbnbRating } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';
import firebase from 'firebase/app';
import Loading from '../../components/Loading';
import { firebaseApp } from '../../utils/firebase';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

const AddReviewRestaurant = ({ navigation, route }) => {
  const toastRef = useRef(null);
  const { idRestaurant } = route.params;
  const [rating, setRating] = useState(null);
  const [formValues, setFormValues] = useState({ title: '', comment: '' });
  const [isLoading, setIsLoading] = useState(false);

  const addReview = () => {
    if (!rating) {
      toastRef.current.show('Debe calificar');
    } else if (!formValues.title) {
      toastRef.current.show('el titulo es obligatorio');
    } else if (!formValues.comment) {
      toastRef.current.show('el comentario esta vacio');
    } else {
      setIsLoading(true);
      const user = firebase.auth().currentUser;
      const payload = {
        idUser: user.uid,
        avatarUser: user.photoURL,
        idRestaurant,
        title: formValues.title,
        review: formValues.comment,
        rating,
        createAt: new Date(),
      };
      db.collection('reviews')
        .add(payload)
        .then(() => {
          updateRestaurant();
        })
        .catch(() => {
          toastRef.current.show('Error al enviar la review');
          setIsLoading(false);
        });
    }
  };

  const formChange = (e, type) => {
    setFormValues({ ...formValues, [type]: e.nativeEvent.text });
  };

  const updateRestaurant = () => {
    const restaurantRef = db.collection('restaurants').doc(idRestaurant);
    restaurantRef.get().then((response) => {
      const restaurantData = response.data();
      const ratingTotal = restaurantData.ratingTotal + rating;
      const quantityVoting = restaurantData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;
      restaurantRef
        .update({
          rating: ratingResult,
          ratingTotal,
          quantityVoting,
        })
        .then(() => {
          setIsLoading(false);
          navigation.goBack();
        });
    });
  };

  return (
    <KeyboardAwareScrollView style={styles.viewScrollContainer}>
      <View style={styles.viewBody}>
        <View style={styles.viewRating}>
          <AirbnbRating
            count={5}
            reviews={[
              'Pésimo',
              'Deficiente',
              'Normal',
              'Muy bueno',
              'Excelente',
            ]}
            defaultRating={0}
            size={35}
            onFinishRating={(value) => {
              setRating(value);
            }}
          />
        </View>
        <View style={styles.formReview}>
          <Input
            placeholder="Titulo"
            containerStyle={styles.input}
            onChange={(e) => formChange(e, 'title')}
          />
          <Input
            placeholder="Comentario..."
            multiline={true}
            inputContainerStyle={styles.textArea}
            onChange={(e) => formChange(e, 'comment')}
          />
          <Button
            title="Enviar Comentario"
            containerStyle={styles.btnContainer}
            buttonStyle={styles.btn}
            onPress={addReview}
          />
        </View>
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={isLoading} text="Enviando comentario" />
    </KeyboardAwareScrollView>
  );
};

export default AddReviewRestaurant;

const styles = StyleSheet.create({
  btn: { backgroundColor: '#00a680' },
  btnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 20,
    marginBottom: 0,
    width: '95%',
  },
  viewBody: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  viewRating: {
    height: 110,
    backgroundColor: '#f2f2f2',
  },
  formReview: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    marginTop: 40,
  },
  input: { marginBottom: 10 },
  textArea: {
    height: 150,
    width: '100%',
    margin: 0,
    padding: 0,
  },
  viewScrollContainer: {
    padding: 0,
    flex: 1,
    margin: 0,
  },
});
