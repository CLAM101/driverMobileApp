import * as React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from "react-native";
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
      <Text style={style.topText}>Welcome, please login</Text>
      <View style={style.inputContainer}>
        <TextInput
          style={style.inputs}
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
          style={style.inputs}
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
      </View>
      <TouchableOpacity
        title="Login"
        onPress={handlePress}
        style={style.button}
      >
        <Text style={style.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0F3D3E",
    flexDirection: "column"
  },
  button: {
    alignItems: "center",
    backgroundColor: "#E2DCC8",
    padding: 20,
    borderRadius: 30,
    top: 70,
    marginLeft: 5,
    elevation: 5,
    width: 280,
    shadowOffset: 15,
    border: 5,
    borderColor: "black",
    marginBottom: 15
  },
  inputContainer: {
    top: 60,
    flex: 0.6
  },
  buttonText: {
    fontSize: 20,
    color: "#0F3D3E"
  },
  inputs: {
    borderWidth: 2,
    borderRadius: 20,
    margin: 10,
    width: 180,
    backgroundColor: "#E2DCC8",
    textAlign: "center",
    color: "#0F3D3E",
    borderColor: "#0F3D3E",
    flex: 0.1
  },
  topText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E2DCC8",
    marginBottom: 20
  }
});
