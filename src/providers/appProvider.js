import { createContext, useState, useEffect } from "react";
import RNLocation from "react-native-location";
import notifee from '@notifee/react-native';

export const AppContext = createContext();

export default function (props) {
    let locationSubscription;
    const {children, ...rest} = props
    const [locationList, updateLocationList] = useState([])
    const [location, setLocation] = useState(null)

    const startUpdatingLocation = () => {
        locationSubscription = RNLocation.subscribeToLocationUpdates(
          locations => {
            setLocation(locations[0])
            onDisplayNotification()
            const temp_location_list = [...locationList]
            temp_location_list.push(locations[0])
            updateLocationList(temp_location_list)
          }
        );
      };
    
      const stopUpdatingLocation = () => {
        locationSubscription && locationSubscription();
        setLocation(null)
      };

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


    async function onDisplayNotification() {
        // Request permissions (required for iOS)
        await notifee.requestPermission()
    
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
        });
    
        // Display a notification
        await notifee.displayNotification({
          title: 'Location Change',
          body: 'Main body content of the notification',
          android: {
            channelId,
            // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            pressAction: {
              id: 'default',
            },
          },
        });
      }


    return(
        <AppContext.Provider value={{
            locationList, updateLocationList,
            location, setLocation,
            startUpdatingLocation, stopUpdatingLocation, 

        }}>
            {children}
        </AppContext.Provider>
    )

}