import * as React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import {
  selectActiveOrder,
  selectDestination,
  selectOrigin,
  selectActiveOrderDetail
} from "../slices/navSlice";
import { setOrigin, setDestination } from "../slices/navSlice";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import MapViewDirections from "react-native-maps-directions";
import { GOOGLE_API_KEY } from "@env";
import * as Linking from "expo-linking";

export default function DriverEnRoute({ navigation }) {
  let activeOrder = useSelector(selectActiveOrder);
  let origin = useSelector(selectOrigin);
  let destination = useSelector(selectDestination);
  const dispatch = useDispatch();

  const mapRef = React.useRef(null);

  function openNavHandlePress() {
    Linking.openURL(
      "https://www.google.com/maps/dir/?api=1&origin=" +
        JSON.stringify(origin.coords.latitude) +
        "," +
        JSON.stringify(origin.coords.longitude) +
        "&destination=" +
        destination
    );
  }

  function convertDestination(destination) {
    console.log(
      "destination in convert function",
      destination,
      "destination typeof",
      typeof destination
    );

    if (typeof destination !== "string") return;

    console.log("convert destination function triggered");

    let commaPos = destination.indexOf(",");

    let latitude = parseFloat(destination.substring(0, commaPos));

    let longitude = parseFloat(
      destination.substring(commaPos + 1, destination.length)
    );

    return {
      latitude: latitude,
      longitude: longitude
    };
  }

  let convertedDestination = convertDestination(destination);

  console.log("Converted Destination", convertedDestination);

  async function getLocation() {
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
      distanceInterval: 1000
    });
    return location;
  }

  console.log(
    "active ordre in driver en route",
    activeOrder,
    "origin in driver en route",
    origin
  );

  function handlePress(e) {
    e.preventDefault();

    // changes order status based on if driver accepts or declines collection
    navigation.navigate("LottieLoadAnimation");
    axios({
      method: "POST",
      data: {
        orderId: activeOrder
      },
      withCredentials: true,
      url: "http://10.0.2.2:3000/drivers/confirm-pickup"
    })
      .then(async (res) => {
        if (res.status === 200) {
          let location = await getLocation();
          console.log(
            "confirm pickup response order destination",
            res.data.updatedDriver.order.destination
          );

          dispatch(setOrigin(location));
          dispatch(setDestination(res.data.updatedDriver.order.destination));

          navigation.navigate("DriverCollected");
        }
        console.log(res);
      })
      .catch(function (error) {
        console.log("error on login", error);
      });
  }

  React.useEffect(() => {
    if (!origin || !convertedDestination) return;

    console.log("map ref use effect triggered DriverEnRoute");
    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
    });
  }, [origin, convertedDestination]);

  return (
    <View style={style.container}>
      <Text style={style.topText}>EnRoute to Restaurant</Text>
      <View style={style.MapViewContainer}>
        <MapView
          ref={mapRef}
          style={style.map}
          mapType="mutedStandard"
          initialRegion={{
            latitude: origin.coords.latitude,
            longitude: origin.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          {origin && convertedDestination && (
            <MapViewDirections
              origin={{
                latitude: origin.coords.latitude,
                longitude: origin.coords.longitude
              }}
              destination={{
                latitude: convertedDestination.latitude,
                longitude: convertedDestination.longitude
              }}
              apikey={GOOGLE_API_KEY}
              strokeWidth={5}
              strokeColor="#0F3D3E"
            />
          )}

          {convertedDestination && (
            <Marker
              coordinate={{
                latitude: convertedDestination.latitude,
                longitude: convertedDestination.longitude
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
        title="confirmPickup"
        onPress={handlePress}
        style={style.button}
      >
        <Text style={style.buttonText}>Confirm Pickup</Text>
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
