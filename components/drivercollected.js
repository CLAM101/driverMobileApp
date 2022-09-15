import * as React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import {
  selectActiveOrder,
  selectOrigin,
  selectDestination,
  setDestination
} from "../slices/navSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setActiveOrder, setOrigin } from "../slices/navSlice";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "@env";
import * as Linking from "expo-linking";

export default function DriverCollected({ navigation }) {
  let activeOrder = useSelector(selectActiveOrder);
  let origin = useSelector(selectOrigin);
  let destination = useSelector(selectDestination);
  const dispatch = useDispatch();
  const mapRef = React.useRef(null);
  let [zoom, setZoom] = React.useState(0);

  function openNavHandlePress() {
    Linking.openURL(
      "https://www.google.com/maps/dir/?api=1&origin=" +
        JSON.stringify(origin.coords.latitude) +
        "," +
        JSON.stringify(origin.coords.longitude) +
        "&destination=" +
        JSON.stringify(destination.coords.latitude) +
        "," +
        JSON.stringify(destination.coords.longitude)
    );
  }

  // console.log(
  //   "new destination in driver collected",
  //   destination,
  //   "origin in in driver collected",
  //   origin
  // );

  async function getLocation() {
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
      distanceInterval: 1000
    });
    return location;
  }

  function handlePress(e) {
    e.preventDefault();

    // changes order status based on if driver accepts or declines collection
    axios({
      method: "POST",
      data: {
        orderId: activeOrder
      },
      withCredentials: true,
      url: "http://10.0.2.2:3000/drivers/complete-order"
    })
      .then((res) => {
        if (res.status === 200) {
          navigation.navigate("NoDelivery");
          dispatch(setActiveOrder(null));
          dispatch(setDestination(null));
        }
      })
      .catch(function (error) {
        console.log("error on login", error);
      });
  }

  React.useEffect(() => {
    if (!origin || !destination) return;

    console.log(
      "map ref use effect triggered",
      "origin",
      origin.coords,
      "destination",
      destination.coords
    );

    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
    });
  }, [zoom]);

  React.useEffect(() => {
    let delay = 3000;

    setTimeout(() => {
      setZoom(2);
    }, delay);

    console.log("setZoom use Effect triggered", zoom);
  }, []);

  return (
    <View style={style.container}>
      <Text style={style.topText}>EnRoute to Customer</Text>
      <View style={style.MapViewContainer}>
        <MapView
          ref={mapRef}
          style={style.map}
          initialRegion={{
            latitude: origin.coords.latitude,
            longitude: origin.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          {origin?.coords && destination?.coords && (
            <MapViewDirections
              origin={{
                latitude: origin.coords.latitude,
                longitude: origin.coords.longitude
              }}
              destination={{
                latitude: destination.coords.latitude,
                longitude: destination.coords.longitude
              }}
              apikey={GOOGLE_API_KEY}
              strokeWidth={3}
              strokeColor="black"
            />
          )}
          {destination?.coords && (
            <Marker
              coordinate={{
                latitude: destination.coords.latitude,
                longitude: destination.coords.longitude
              }}
              title="destination"
              identifier="destination"
            />
          )}
          {origin?.coords && (
            <Marker
              coordinate={{
                latitude: origin.coords.latitude,
                longitude: origin.coords.longitude
              }}
              title="origin"
              identifier="origin"
            />
          )}
        </MapView>
      </View>

      <TouchableOpacity
        title="Confirm Drop Off"
        onPress={handlePress}
        style={style.button}
      >
        <Text style={style.buttonText}>Confirm Drop Off</Text>
      </TouchableOpacity>

      <TouchableOpacity
        title="openNav"
        onPress={openNavHandlePress}
        style={style.button}
      >
        <Text style={style.buttonText}>Open Navigation</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F3D3E"
  },
  MapViewContainer: {
    borderWidth: 5,
    borderColor: "#E2DCC8",
    borderRadius: 5,
    marginBottom: 40
  },
  map: {
    width: 300,
    height: 400
  },
  button: {
    alignItems: "center",
    backgroundColor: "#E2DCC8",
    padding: 20,
    borderRadius: 30,
    marginTop: 2,
    marginLeft: 5,
    elevation: 5,
    width: 280,
    shadowOffset: 15,
    border: 5,
    borderColor: "black",
    marginBottom: 15
  },
  buttonText: {
    fontSize: 20,
    color: "#0F3D3E"
  },
  topText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#E2DCC8"
  }
});
