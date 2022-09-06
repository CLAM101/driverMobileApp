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
    <View style={style.container}>
      <Text style={style.topText}>
        You are online and available to accept deliveries
      </Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    backgroundColor: "#0F3D3E",
    flex: 1,
    alignItems: "center"
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
