import * as React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import AcceptOrDecline from "./acceptordecline";
import DriverEnRoute from "./driverenroute";
import DriverCollected from "./drivercollected";
import NoDelivery from "./nodelivery";
import LottieLoadAnimation from "./lottieloadanimation";

const Stack = createStackNavigator();

export default function CurrentDelivery({ navigation }) {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="NoDelivery"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          name="AcceptOrDecline"
          component={AcceptOrDecline}
        />
        <Stack.Screen
          name="DriverEnRoute"
          component={DriverEnRoute}
        />
        <Stack.Screen
          name="DriverCollected"
          component={DriverCollected}
        />
        <Stack.Screen
          name="NoDelivery"
          component={NoDelivery}
        />
        <Stack.Screen
          name="LottieLoadAnimation"
          component={LottieLoadAnimation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
