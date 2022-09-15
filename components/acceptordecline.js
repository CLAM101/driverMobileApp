import * as React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  selectActiveOrder,
  selectActiveOrderDetail,
  setAvailableCollection,
  setDestination
} from "../slices/navSlice";

export default function AcceptOrDecline({ navigation }) {
  let activeOrder = useSelector(selectActiveOrder);
  const dispatch = useDispatch();

  let deliveryInfo = useSelector(selectActiveOrderDetail);

  console.log(
    "travel info in accept or decline",
    deliveryInfo.travelInfo.rows[0].elements[0].duration.value
  );

  let toRestDuration =
    deliveryInfo.travelInfo.rows[0].elements[0].duration.text;
  let toRestDistance =
    deliveryInfo.travelInfo.rows[0].elements[0].distance.text;

  let toCustDuration =
    deliveryInfo.travelInfo.rows[1].elements[1].duration.text;
  let toCustDistance =
    deliveryInfo.travelInfo.rows[1].elements[1].distance.text;

  let totalTravelDuration =
    (deliveryInfo.travelInfo.rows[0].elements[0].duration.value +
      deliveryInfo.travelInfo.rows[1].elements[1].duration.value) /
    60;
  let totalTravelDistance =
    (deliveryInfo.travelInfo.rows[0].elements[0].distance.value +
      deliveryInfo.travelInfo.rows[1].elements[1].distance.value) /
    1000;

  console.log(
    "total travel duration in accept or decline",
    totalTravelDuration,
    "Total Travel Distance in accept or decline",
    totalTravelDistance
  );

  function handlePressDecline() {
    e.preventDefault();
    dispatch(setAvailableCollection(false));
    dispatch(setDestination(null));
    navigation.navigate("NoDelivery");
  }

  function handlePress(e) {
    e.preventDefault();

    console.log("active order in state", activeOrder);

    // changes order status based on if driver accepts or declines collection
    axios({
      method: "POST",
      data: {
        orderId: activeOrder
      },
      withCredentials: true,
      url: "http://10.0.2.2:3000/drivers/accept-or-decline"
    })
      .then(async (res) => {
        console.log(res);

        dispatch(setAvailableCollection(null));
        navigation.navigate("noDelivery");
      })
      .catch(function (error) {
        console.log("error on login", error);
      });
  }

  return (
    <View style={style.container}>
      <View style={style.travelTimeContainer}>
        <Text style={style.nameText}>
          Restaurant Name: {deliveryInfo.restName}
        </Text>
        <Text style={style.nameText}>
          Estimated Travel Time & Distance To Restaurant
        </Text>
        <Text style={style.travelTimeText}>{toRestDuration}</Text>
        <Text style={style.travelTimeText}>{toRestDistance}</Text>
        <Text style={style.nameText}>
          Estimated Travel Time & Distance To Customer
        </Text>
        <Text style={style.travelTimeText}>{toCustDuration}</Text>
        <Text style={style.travelTimeText}> {toCustDistance}</Text>
        <Text style={style.nameText}>Total Travel Time & Distance</Text>
        <Text style={style.travelTimeText}>
          {parseInt(totalTravelDuration)} mins
        </Text>
        <Text style={style.travelTimeText}>{totalTravelDistance} Km</Text>
        <Text style={style.travelTimeText}>
          Delivery Fee: R{parseInt(totalTravelDistance * 10)}
        </Text>
      </View>

      <TouchableOpacity
        title="Accept"
        onPress={handlePress}
        style={style.button}
      >
        <Text style={style.buttonText}>Accept Delivery</Text>
      </TouchableOpacity>

      <TouchableOpacity
        title="Decline"
        onPress={handlePressDecline}
        style={style.button}
      >
        <Text style={style.buttonText}>Decline Delivery</Text>
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
  button: {
    alignItems: "center",
    backgroundColor: "#E2DCC8",
    padding: 15,
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

  travelTimeText: {
    fontSize: 14,
    marginLeft: 15,
    marginBottom: 20,
    color: "#0F3D3E",
    fontWeight: "bold"
  },
  travelTimeContainer: {
    borderWidth: 5,
    borderColor: "#E2DCC8",
    width: 300,
    flex: 0.8,
    borderRadius: 20,
    backgroundColor: "#E2DCC8",
    bottom: 35,
    alignItems: "center"
  },
  distanceText: {
    fontSize: 17,
    marginLeft: 15
  },
  nameText: {
    marginBottom: 15,
    fontSize: 17,
    marginLeft: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "#0F3D3E"
  }
});
