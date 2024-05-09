import React, { useContext, useEffect } from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image
} from "react-native";
// import RNLocation from "react-native-location";
import moment from "moment";

import { AppContext } from "../../providers/appProvider";

const repoUrl = "https://github.com/timfpark/react-native-location";

export default () => {
  const {
    locationList, updateLocationList,
    location, setLocation,
    startUpdatingLocation, stopUpdatingLocation,
    startBackgroundLocationTrack, stopBackgroundLocationTrack,
    places,
  } = useContext(AppContext)

  const openRepoUrl = () => {
    Linking.openURL(repoUrl).catch(err =>
      console.error("An error occurred", err)
    );
  };
  console.log('location', location, locationList)
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.innerContainer}>
        <View style={{ alignItems: "center", marginTop: 30 }}>
          <Text style={styles.title}>react-native-location</Text>
          <TouchableHighlight
            onPress={openRepoUrl}
            underlayColor="#CCC"
            activeOpacity={0.8}
          >
            <Text style={styles.repoLink}>{repoUrl}</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.row}>
          <TouchableHighlight
            onPress={startUpdatingLocation}
            style={[styles.button, { backgroundColor: "#126312" }]}
          >
            <Text style={styles.buttonText}>Start FG</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={stopUpdatingLocation}
            style={[styles.button, { backgroundColor: "#881717" }]}
          >
            <Text style={styles.buttonText}>Stop FG</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.row}>
          <TouchableHighlight
            onPress={startBackgroundLocationTrack}
            style={[styles.button, { backgroundColor: "#126312" }]}
          >
            <Text style={styles.buttonText}>Start BG</Text>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={stopBackgroundLocationTrack}
            style={[styles.button, { backgroundColor: "#881717" }]}
          >
            <Text style={styles.buttonText}>Stop BG</Text>
          </TouchableHighlight>
        </View>


        {location && (
          <React.Fragment>
            <View style={styles.row}>
              <View style={[styles.detailBox, styles.third]}>
                <Text style={styles.valueTitle}>Course</Text>
                <Text style={[styles.detail, styles.largeDetail]}>
                  {location.course}
                </Text>
              </View>

              <View style={[styles.detailBox, styles.third]}>
                <Text style={styles.valueTitle}>Speed</Text>
                <Text style={[styles.detail, styles.largeDetail]}>
                  {location.speed}
                </Text>
              </View>

              <View style={[styles.detailBox, styles.third]}>
                <Text style={styles.valueTitle}>Altitude</Text>
                <Text style={[styles.detail, styles.largeDetail]}>
                  {location.altitude}
                </Text>
              </View>
            </View>

            <View style={{ alignItems: "flex-start" }}>
              <View style={styles.row}>
                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Latitude</Text>
                  <Text style={styles.detail}>{location.latitude}</Text>
                </View>

                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Longitude</Text>
                  <Text style={styles.detail}>{location.longitude}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Accuracy</Text>
                  <Text style={styles.detail}>{location.accuracy}</Text>
                </View>

                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Altitude Accuracy</Text>
                  <Text style={styles.detail}>
                    {location.altitudeAccuracy}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Timestamp</Text>
                  <Text style={styles.detail}>{location.timestamp}</Text>
                </View>

                <View style={[styles.detailBox, styles.half]}>
                  <Text style={styles.valueTitle}>Date / Time</Text>
                  <Text style={styles.detail}>
                    {moment(location.timestamp).format("MM-DD-YYYY h:mm:ss")}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.detailBox, styles.full]}>
                  <Text style={styles.json}>{JSON.stringify(location)}</Text>
                </View>
              </View>
            </View>
          </React.Fragment>
        )}

      </SafeAreaView>
      {
        places?.distances && places?.distances.map((loc, i) => {
          // console.log('distance', loc)
          return <View key={i} style={{flex: 1, flexDirection: 'row'}}>
            {loc.icon && <Image
              style={{width: 20, height: 20}}
              source={{
                // uri: 'https://reactnative.dev/img/tiny_logo.png',
                uri: loc.icon
              }}
              // source={{
              //   uri: loc.icon,
              // }}
            />}
            <Text>{` ${i + 1} . ${loc.name}`}</Text>
          </View>
        })
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#CCCCCC"
  },
  innerContainer: {
    marginVertical: 30
  },
  title: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold"
  },
  repoLink: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#0000CC",
    textDecorationLine: "underline"
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginTop: 5,
    marginBottom: 5
  },
  detailBox: {
    padding: 15,
    justifyContent: "center"
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10
  },
  buttonText: {
    fontSize: 30,
    color: "#FFFFFF"
  },
  valueTitle: {
    fontFamily: "Futura",
    fontSize: 12
  },
  detail: {
    fontSize: 15,
    fontWeight: "bold"
  },
  largeDetail: {
    fontSize: 20
  },
  json: {
    fontSize: 12,
    fontFamily: "Courier",
    textAlign: "center",
    fontWeight: "bold"
  },
  full: {
    width: "100%"
  },
  half: {
    width: "50%"
  },
  third: {
    width: "33%"
  }
});