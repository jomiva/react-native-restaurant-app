import firebase from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyB6de33bhZmjTv_3zCCdVt7zMgCNuH4H2c',
  authDomain: 'tenedores-f9cf1.firebaseapp.com',
  databaseURL: 'https://tenedores-f9cf1.firebaseio.com',
  projectId: 'tenedores-f9cf1',
  storageBucket: 'tenedores-f9cf1.appspot.com',
  messagingSenderId: '779530338153',
  appId: '1:779530338153:web:af4fc13cd6bd27d777c7f8',
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
