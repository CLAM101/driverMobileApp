import * as React from "react";
import { View, Text, Button, StyleSheet, TextInput } from "react-native";
import { setDestination, setLoggedState } from "../slices/navSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

export default function DriverLogin() {
  const [formState, setFormState] = React.useState({
    username: "",
    email: "",
    password: ""
  });

  const dispatch = useDispatch();

  function login() {
    console.log("password", formState.password, "username", formState.username);

    axios({
      method: "POST",
      data: {
        username: formState.username,
        // email: formState.email,
        password: formState.password
      },
      withCredentials: true,
      url: "http://10.0.2.2:3000/drivers/login"
    })
      .then((res) => {
        console.log(res);
        dispatch(setLoggedState(true));

        console.log("username", res.data.username);
      })
      .catch(function (error) {
        console.log("error on login", error);
      });
  }

  function checkLog() {
    console.log("check log called");
    axios({
      method: "POST",
      withCredentials: true,
      url: "http://10.0.2.2:3000/drivers/logStatusCheck"
    })
      .then((response) => {
        console.log("response on checkLog driver", response.data);

        if (response.data === true) {
          dispatch(setLoggedState(true));
        } else {
        }
      })
      .catch((error) => {
        console.log("error on checklog driver logged in", error);
      });
  }

  // handle press for login button
  function handlePress(event) {
    event.preventDefault();
    login();
  }

  React.useEffect(() => {
    checkLog();
  }, []);

  return (
    <View style={style.container}>
      <Text>Welcome, please login</Text>
      <TextInput
        onChangeText={(text) => {
          setFormState({
            ...formState,
            username: text
          });
        }}
        value={formState.username}
        placeholder="username"
        name="username"
      />
      <TextInput
        onChangeText={(text) => {
          setFormState({
            ...formState,
            password: text
          });
        }}
        value={formState.password}
        secureTextEntry={true}
        placeholder="password"
      />
      <Button
        color="black"
        onPress={handlePress}
        title="Login"
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
