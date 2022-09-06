import * as React from "react";
import { Button, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import animation from "../assets/118336-please-wait (1).json";

export default function LottieLoadAnimation({ navigation }) {
  return (
    <View style={style.container}>
      <LottieView
        autoPlay
        source={animation}
        style={{
          width: 200,
          height: 200,
          backgroundColor: "#E2DCC8"
        }}
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E2DCC8"
  }
});
