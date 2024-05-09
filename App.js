/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Linking,
  Platform
} from 'react-native';
import notifee, { EventType } from '@notifee/react-native';
import AppProvider  from './src/providers/appProvider';
import LocationComponent from './src/components/LocationComponent'
// import MapComponent from './src/components/MapComponent';

function App() {
   // Subscribe to events
   useEffect(() => {
    const unsubscribe =  notifee.onForegroundEvent(({ type, detail, ...rest }) => {
      console.log('subscribe event', {type, detail, rest})
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', {type, detail, rest});
          break;
        case EventType.PRESS:
          console.log('User pressed notification', {type, detail, rest});
          if(detail.pressAction.id === 'open-map'){
            console.log('opening maps', detail)
            const {latitude, longitude} = detail.notification.data
            const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
            const latLng = `${latitude},${longitude}`;
            const label = 'Open In Maps';
            const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
            })

            notifee.cancelNotification(detail.notification.id);
            Linking.openURL(url);
          }
          break;
      }
    });
    return () => unsubscribe()
  }, []);

  return (
    <AppProvider>
      <LocationComponent/>
      {/* <MapComponent/> */}
    </AppProvider>
  );
}
export default App;
