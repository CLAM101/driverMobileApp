import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Settings({ navigation }) {
  return (
    <View style={style.container}>
      <Text style={style.topText}>Settings</Text>
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
