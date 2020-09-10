import React from 'react';
import { YellowBox } from 'react-native';
import Navigation from './app/navigations/Navigation';
// eslint-disable-next-line no-unused-vars
import { firebaseApp } from './app/utils/firebase';

// require('dotenv').config();

YellowBox.ignoreWarnings(['Setting a timer']);

const App = () => {
  return <Navigation />;
};

export default App;
