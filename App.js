/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import AppProvider  from './src/providers/appProvider';
import LocationComponent from './src/components/LocationComponent'

function App() {
  return (
    <AppProvider>
      <LocationComponent/>
    </AppProvider>
  );
}
export default App;
