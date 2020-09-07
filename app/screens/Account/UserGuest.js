import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-elements';

const UserGuest = () => {
  return (
    <ScrollView centerContent={true} style={styles.viewBody}>
      <Image
        style={styles.image}
        source={require('../../../assets/img/user-guest.jpg')}
        resizeMode="contain"
      />
      <Text style={styles.title}>Consulta tu perfil de tenedores</Text>
      <Text style={styles.description}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis
        maiores distinctio ipsam amet, molestias delectus atque minus esse autem
        vel ullam expedita voluptatum? Iste, corporis? Nesciunt eius
        exercitationem nam omnis.
      </Text>
      <View style={styles.viewBtn}>
        <Button
          buttonStyle={styles.btnStyle}
          containerStyle={styles.btnContainer}
          title="Ver tu perfil"
          onPress={() => {
            console.log('click');
          }}
        />
      </View>
    </ScrollView>
  );
};

export default UserGuest;

const styles = StyleSheet.create({
  viewBody: {
    marginLeft: 30,
    marginRight: 30,
  },
  image: {
    height: 300,
    width: '100%',
    marginBottom: 40,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 19,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  viewBtn: { flex: 1, alignItems: 'center' },
  btnStyle: {
    backgroundColor: '#00a655',
  },
  btnContainer: {
    width: '70%',
  },
});
