import * as React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import {
  selectActiveOrder,
  selectOrigin,
  selectDestination,
  setDestination
} from "../slices/navSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setActiveOrder } from "../slices/navSlice";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

export default function DriverCollected({ navigation }) {
  let activeOrder = useSelector(selectActiveOrder);
  let origin = useSelector(selectOrigin);
  let destination = useSelector(selectDestination);

  const mapRef = React.useRef(null);

  console.log(
    "new destination in driver collected",
    destination,
    "origin in in driver collected",
    origin
  );

  const dispatch = useDispatch();

  function handelPress(e) {
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
    // if (!origin || !destination) return;

    mapRef.current.fitToSuppliedMarkers(["origin", "destination"], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
    });
  }, []);

  return (
    <View style={style.container}>
      <Text>Driver Collected</Text>
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
      </MapView>
      <Button
        title="Confirm Drop off"
        onPress={handelPress}
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
