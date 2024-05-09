import { createContext, useState, useEffect } from "react";
import { Platform, Linking } from "react-native";
import RNLocation from "react-native-location";
import notifee from '@notifee/react-native';
import getDistance from "geolib/es/getPreciseDistance";

import BackgroundService from 'react-native-background-actions';

import mockPlaces from './mockPlaces.json'

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time))

// You can do anything in your task such as network requests, timers and so on,
// as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
// React Native will go into "paused" mode (unless there are other tasks running,
// or there is a foreground app).


const options = {
  taskName: 'Location Track',
  taskTitle: 'Location Tracker',
  taskDesc: 'tracks the location in bg',
  taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
  },
  color: '#ff00ff',
  // linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
      delay: 1000,
  },
};

export const AppContext = createContext();

export default function (props) {
    let locationSubscription;
    const {children, ...rest} = props
    const [locationList, updateLocationList] = useState([])
    const [location, setLocation] = useState(null)
    const [couter, setCounter] = useState(0)
    const [places, setPlaces] = useState({cords: []})

    const fetchPlaceNearBy =  (locationData) => {
      // try {
      //   // 17.383619698271566, 78.39940439021058
      //   const {latitude, longitude} = locationData
      //   const keyword = 'golconda'
      //   // const API_KEY = ''
      //   const  API_KEY = 'AIzaSyDBVDHD3_MoDX0K_J3F7hPxmrMmgedmQ6A'
      //   const lat = 17.383619698271566
      //   const lng = 78.39940439021058
      //   const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=10000&type=point_of_interest&keyword=${keyword}&key=${API_KEY}`
      //   console.log('fetch location ', url)
      //   const response = await fetch(url)
      //   const result = await response.json()
      //   console.log('place response', result, JSON.stringify(result.results))
      // } catch (error) {
      //   console.log('location api error', error)
      // }

      return mockPlaces
    }

    const startUpdatingLocation =async () => {
        locationSubscription = await RNLocation.subscribeToLocationUpdates(
          locations => {
            setLocation(locations[0])
            onDisplayNotification(locations[0])
            const temp_location_list = [...locationList]
            temp_location_list.push(locations[0])
            updateLocationList(temp_location_list)
            const cords = fetchPlaceNearBy(locations[0]).results
            console.log('locatons', {locations, cords})
            const current = {
              lat: 17.383619698271566, lng: 78.39940439021058
            }
            const distances = cords.map((station) => {
              const coord = station.geometry.location
              return {...station,  coord, dist: getDistance(current, coord) }
            })
            const pl = {cords, distances, shortDistnce: distances.sort( (a, b) => a.dist - b.dist )[0]}
            setPlaces(pl)
            console.log( 'cords', pl)
          }
        );
      };
    
      const stopUpdatingLocation = () => {
        locationSubscription && locationSubscription();
        setLocation(null)
      };

      const veryIntensiveTask = async (taskDataArguments) => {
        try {
        // Example of an infinite loop task
        const { delay } = taskDataArguments;
        await new Promise( async (resolve) => {
          // locationSubscription = RNLocation.subscribeToLocationUpdates(
          //   locations => {
          //     console.log('location update', locations);
          //     setLocation(locations[0]);
          //     onDisplayNotification(locations[0]);
          //     const temp_location_list = [...locationList];
          //     temp_location_list.push(locations[0]);
          //     updateLocationList(temp_location_list);
          //   }
          // );
          startUpdatingLocation()
            for (let i = 0; BackgroundService.isRunning(); i++) {
              console.log('i is', i, locationList)
              await BackgroundService.updateNotification({taskDesc: 'New Location Found' + i}); 
              setCounter(i+2)
                await sleep(delay);
            }
        });           
      } catch (error) {
          console.log('Intensive task error', error)
      }
      };

      const startBackgroundLocationTrack = async () => {
        try {          
          await BackgroundService.start(veryIntensiveTask, options);
          await BackgroundService.updateNotification({taskDesc: 'New Location Found'}); // Only Android, iOS will ignore this call
          await locationSubscription && locationSubscription();
          setLocation(null)
        } catch (error) {
          console.log('start bg service error ', error)
        }
      }
      const stopBackgroundLocationTrack = async () => {
        await BackgroundService.stop();
      }

    const onMount = () => {
        console.log('mount location component')
        RNLocation.configure({
            distanceFilter: 5.0
          });
          
          RNLocation.requestPermission({
            ios: "whenInUse",
            android: {
              detail: "fine",
              rationale: {
                title: "Location permission",
                message: "We use your location to demo the library",
                buttonPositive: "OK",
                buttonNegative: "Cancel"
              }
            }
          }).then(granted => {
            if (granted) {
              startUpdatingLocation(); 
            }
          });
    }

    useEffect(()=>{
        onMount()
    },[])


    async function onDisplayNotification(location) {
        const {latitude="", longitude = ""} = location
        // Request permissions (required for iOS)
        await notifee.requestPermission()
    
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'nearby-app',
          name: 'nearby channel',
        });
    
        // Display a notification
        await notifee.displayNotification({
          title: 'NearBy',
          body: `location: lat: ${latitude} - long: ${longitude}`,
          data: {latitude, longitude},
          android: {
            channelId,
            // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'open-map',
            //   action: () => {
            //    const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=' });
            //    const latLng = `${latitude},${longitude}`;
            //    const label = 'Open In Maps';
            //    const url = Platform.select({
            //    ios: `${scheme}${label}@${latLng}`,
            //    android: `${scheme}${latLng}(${label})`
            //    })
            //    Linking.openURL(url);
            //   }
            },
          },
        });
      }


    return(
        <AppContext.Provider value={{
            locationList, updateLocationList,
            location, setLocation,
            startUpdatingLocation, stopUpdatingLocation,
            startBackgroundLocationTrack, stopBackgroundLocationTrack,
            places,

        }}>
            {children}
        </AppContext.Provider>
    )

}