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
      // console.log("response status check log driver logged in", response);
      if (response.data === false) {
        dispatch(setLoggedState(false));
      }
    });
  }

  return (
    <Appbar.Header>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content
        title={<Text style={style.headerText}>Budget Bites</Text>}
      />
      {!back ? (
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon="menu"
              color="#0F3D3E"
              onPress={openMenu}
            />
          }
        >
          <Menu.Item
            style={{ backgroundColor: "#E2DCC8" }}
            onPress={() => navigation.navigate("Settings")}
            title={<Text style={style.menuText}>Settings</Text>}
          />
          <Menu.Item
            style={{ backgroundColor: "#E2DCC8" }}
            onPress={() => navigation.navigate("CurrentDelivery")}
            title={<Text style={style.menuText}>Current Delivery</Text>}
          />
          <Menu.Item
            style={{ backgroundColor: "#E2DCC8" }}
            onPress={() => navigation.navigate("OrderHistory")}
            title={<Text style={style.menuText}>Order History</Text>}
          />
          <Menu.Item
            style={{ backgroundColor: "#E2DCC8" }}
            onPress={logOut}
            title={<Text style={style.menuText}>Logout</Text>}
          />
        </Menu>
      ) : null}
    </Appbar.Header>
  );
}

const style = StyleSheet.create({
  headerText: {
    color: "#0F3D3E",
    fontWeight: "bold",
    fontSize: 30
  },
  menuText: {
    fontSize: 20,
    fontWeight: "bold"
  }
});
