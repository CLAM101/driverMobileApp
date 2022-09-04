import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import DriverHome from "./components/driverhome";
import DriverLogin from "./components/driverlogin";
import AppHeader from "./components/appheader";
import { Provider } from "react-redux";
import { store } from "./store";
import { useSelector } from "react-redux";
import { selectLoggedState, selectOrigin } from "./slices/navSlice";
import DriverLoggedIn from "./components/driverloggedin";
import axios from "axios";
import * as Location from "expo-location";
import Pusher from "pusher-js/react-native";
import { PUSHER_KEY } from "@env";
import {
  setDestination,
  setLoggedState,
  setActiveOrder,
  setAvailableCollection,
  setOrigin
} from "./slices/navSlice";
import { useDispatch } from "react-redux";

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
  const dispatch = useDispatch();
  // gets current driver location
  async function getLocation() {
    let location = await Location.getCurrentPositionAsync({
      enableHighAccuracy: true,
      accuracy: Location.Accuracy.Highest,
      maximumAge: 10000,
      distanceInterval: 1000
    });

    return location;
  }

  async function getLoggedState(data) {
    console.log("data result passed to get logged state", data.result);
    try {
      if (
        data.result !== undefined &&
        JSON.stringify(data.result).includes("ready for collection")
      ) {
        const newLocation = await getLocation();
        dispatch(setOrigin(newLocation));

        console.log("new location", newLocation);
        axios({
          method: "POST",
          withCredentials: true,
          url: "http://10.0.2.2:3000/drivers/isloggedin",
          data: {
            orderId: data.result._id,
            newLocation: newLocation
          }
        })
          .then((response) => {
            console.log(
              "response on loggedin check drivers",
              response.data.restLocation
            );

            if (response.data.status === true) {
              dispatch(setActiveOrder(data.result._id));
              dispatch(setDestination(response.data.restLocation));
              dispatch(setAvailableCollection(true));
            }
          })
          .catch((error) => {
            console.log("pusher promise error", error);
          });
      }
    } catch (error) {
      console.log("try catch error get logged state get location", error);
    }
  }

  //creates new pusher instance
  function pusherFunction(props) {
    console.log("pusher key env", PUSHER_KEY);
    const pusher = new Pusher(PUSHER_KEY, {
      cluster: "eu"
    });

    //subscribers the pusher instance to the channel defined on the backend
    const channel = pusher.subscribe("rests");

    // listens for a specific action defined on the backend, once action takes place
    // fires when order status is changed to "ready for collection", passes order detail via data, then calls function to verify driver and prompt delivery acceptance passing in data from pusher change
    channel.bind("updated", (data) => {
      console.log("data on updated", data);

      // identifies specific user  and its logged state with data provided by pusher
      getLoggedState(data);
    });
    // unsubscribes from the channel after use to avoid too many concurrent
    // connections resulting in the limit being reached on pusher.
    return () => {
      console.log("return fired");
      pusher.unsubscribe("rests");
      // props = false;
    };
  }

  //use effect to initiate pusher
  React.useEffect(() => {
    let mounted = true;
    if (mounted) {
      console.log("mounted pusher use effect");

      pusherFunction(mounted);
    }
  }, []);

  // use effect to request location permissions on app launch
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log("location access call fired", status);

      try {
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          console.log("error message on location permissions", errorMsg);
          return;
        }
      } catch (error) {
        console.log("Try catch error location", error);
      }
    })();
    // console.log("location state", location);
  }, []);

  let loggedState = useSelector(selectLoggedState);

  console.log("logged state in app", loggedState);

  return (
    <PaperProvider>
      {loggedState === true ? <DriverLoggedIn /> : <DriverLogin />}
    </PaperProvider>
  );
}
