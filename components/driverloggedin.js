import { createStackNavigator } from "@react-navigation/stack";
import AppHeader from "./appheader";
import DriverHome from "./driverhome";
import CurrentDelivery from "./currentdelivery";
import { NavigationContainer } from "@react-navigation/native";
import Settings from "./settings";
import OrderHistory from "./orderhistory";
import LottieLoadAnimation from "./lottieloadanimation";

const Stack = createStackNavigator();

export default function DriverLoggedIn() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DriverHome"
        screenOptions={{
          header: (props) => <AppHeader {...props} />
        }}
      >
        <Stack.Screen
          name="DriverHome"
          component={DriverHome}
        />
        <Stack.Screen
          name="CurrentDelivery"
          component={CurrentDelivery}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
        />
        <Stack.Screen
          name="OrderHistory"
          component={OrderHistory}
        />
        <Stack.Screen
          name="LottieLoadAnimation"
          component={LottieLoadAnimation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
