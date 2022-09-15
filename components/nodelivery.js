import * as React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import {
  selectAvailableCollection,
  selectActiveOrder,
  setDestination,
  setLoggedState
} from "../slices/navSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setActiveOrder,
  setAvailableCollection,
  setOrigin
} from "../slices/navSlice";
import * as Location from "expo-location";

export default function NoDelivery({ navigation }) {
  async function getLocation() {
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
      distanceInterval: 1000
    });
    return location;
  }

  const dispatch = useDispatch();
  const availableCollection = useSelector(selectAvailableCollection);
  const activeOrder = useSelector(selectActiveOrder);

  // console.log(
  //   "available collection state in no delivery",
  //   availableCollection,
  //   "active order state in do delivery",
  //   activeOrder
  // );

  async function getActiveOrderStatus() {
    if (availableCollection === true) {
      navigation.navigate("AcceptOrDecline");
    } else {
      navigation.navigate("LottieLoadAnimation");
      axios({
        method: "POST",
        withCredentials: true,
        url: "http://10.0.2.2:3000/drivers/get-order-status"
      })
        .then(async (response) => {
          console.log(
            "get active order status response",
            response.data.restLocation
          );
          if (response.data === "Please log in") {
            dispatch(setLoggedState(false));
          }
          dispatch(setActiveOrder(response.data.activeOrder._id));

          if (response.data.activeOrder.status === "driver on way to collect") {
            let location = await getLocation();
            dispatch(setOrigin(location));
            dispatch(setDestination(response.data.restLocation));
            navigation.navigate("DriverEnRoute");
          } else if (response.data.activeOrder.status === "out for delivery") {
            let location = await getLocation();
            dispatch(setOrigin(location));
            dispatch(setDestination(response.data.activeOrder.destination));
            navigation.navigate("DriverCollected");
          }
        })
        .catch((error) => {
          console.log("get active order status error", error);
          navigation.navigate("NoDelivery");
        });
    }
  }

  React.useEffect(() => {
    console.log("no delivery in current delivery use effect fired");
    getActiveOrderStatus();
  }, [availableCollection]);

  return (
    <View style={style.container}>
      <Text style={style.topText}>No Active Deliveries</Text>
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
  topText: {
    top: 20,
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#E2DCC8",
    textAlign: "center"
  }
});
