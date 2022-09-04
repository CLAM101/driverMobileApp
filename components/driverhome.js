import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import {
  selectActiveOrder,
  selectAvailableCollection
} from "../slices/navSlice";

export default function DriverHome({ navigation }) {
  let availableCollection = useSelector(selectAvailableCollection);
  let activeOrder = useSelector(selectActiveOrder);
  console.log(
    "active order driver home",
    activeOrder,
    "available collection",
    availableCollection
  );

  React.useEffect(() => {
    console.log("driver home use effect called");

    if (activeOrder !== null && availableCollection === true) {
      navigation.navigate("CurrentDelivery");
    }
  }, [activeOrder, availableCollection]);

  return (
    <View>
      <Text>You are online and available to accept deliveries</Text>
    </View>
  );
}
