import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Appbar, Menu } from "react-native-paper";
import { ReloadInstructions } from "react-native/Libraries/NewAppScreen";
import { setLoggedState } from "../slices/navSlice";
import axios from "axios";
import { useDispatch } from "react-redux";

export default function AppHeader({ navigation, back }) {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const dispatch = useDispatch();

  function logOut() {
    axios({
      method: "POST",
      url: "http://10.0.2.2:3000/drivers/logout",
      withCredentials: true
    }).then((response) => {
      console.log("response status check log driver logged in", response);
      if (response.data === false) {
        dispatch(setLoggedState(false));
      }
    });
  }

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="Budget Bites" />
      {!back ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="menu"
              color="black"
              onPress={openMenu}
            />
          }
        >
          <Menu.Item
            onPress={() => navigation.navigate("Settings")}
            title="Settings"
          />
          <Menu.Item
            onPress={() => navigation.navigate("CurrentDelivery")}
            title="CurrentDelivery"
          />
          <Menu.Item
            onPress={() => navigation.navigate("OrderHistory")}
            title="Order History"
          />
          <Menu.Item
            onPress={logOut}
            title="Logout"
          />
        </Menu>
      ) : null}
    </Appbar.Header>
  );
}
