import * as React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import {
  selectActiveOrder,
  selectDestination,
  selectOrigin
} from "../slices/navSlice";
import { setOrigin, setDestination } from "../slices/navSlice";
import axios from "axios";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import MapViewDirections from "react-native-maps-directions";

export default function DriverEnRoute({ navigation }) {
  let activeOrder = useSelector(selectActiveOrder);
  let origin = useSelector(selectOrigin);
  let destination = useSelector(selectDestination);
  const dispatch = useDispatch();

  const mapRef = React.useRef(null);

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

    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
    });
  }, [origin, convertedDestination]);

  return (
    <View style={style.container}>
      <Text>Driver En Route</Text>
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
            strokeWidth={3}
            strokeColor="black"
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
      <Button
        title="Confirm Pickup"
        onPress={handlePress}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    top: 5,
    width: 393,
    height: 650
  }
});
