import * as React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  selectActiveOrder,
  setAvailableCollection,
  setDestination
} from "../slices/navSlice";

export default function AcceptOrDecline({ navigation }) {
  let activeOrder = useSelector(selectActiveOrder);
  const dispatch = useDispatch();

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
        navigation.navigate("DriverEnRoute");
      })
      .catch(function (error) {
        console.log("error on login", error);
      });
  }

  return (
    <View style={style.container}>
      <Text>Accept Or Decline</Text>
      <Button
        title="Accept"
        onPress={handlePress}
      />
      <Button
        title="Decline"
        onPress={handlePressDecline}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
