import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function OrderHistory({ navigation }) {
  return (
    <View style={style.container}>
      <Text>Order History</Text>
      <Button
        title="login"
        onPress={() => navigation.navigate("DriverHome")}
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
