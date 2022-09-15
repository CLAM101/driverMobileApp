import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { DataTable } from "react-native-paper";
import axios from "axios";
import { setOrderHistory } from "../slices/navSlice";
import { selectOrderHistory } from "../slices/navSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const theme = {
  roundness: 2,
  version: 3,
  colors: {
    primary: "#3498db",
    secondary: "#f1c40f",
    tertiary: "#a1b2c3",
    surface: "#0F3D3E",
    onSurface: "#0F3D3E",
    background: "#0F3D3E"
  }
};

export default function OrderHistory({ navigation }) {
  const dispatch = useDispatch();
  let orderHistory = useSelector(selectOrderHistory);

  const [page, setPage] = React.useState(1);

  let from;
  let to;
  const [numberOfItemsPerPage, onItemsPerPageChange] = React.useState(12);

  let slicedOrderHistory;

  if (orderHistory !== null) {
    from = page * numberOfItemsPerPage;
    to = Math.min((page + 1) * numberOfItemsPerPage, orderHistory.length);
    slicedOrderHistory = orderHistory.slice(from, to);
  }

  async function getOrderHistory() {
    navigation.navigate("LottieLoadAnimation");
    await axios({
      method: "POST",
      withCredentials: true,
      url: "http://10.0.2.2:3000/drivers/get-order-history"
    })
      .then(async (response) => {
        console.log("get orderhistory response", response.data);

        dispatch(setOrderHistory(response.data.orderHistory));

        let delay = 3000;

        setTimeout(() => {
          navigation.navigate("OrderHistory");
        }, delay);
      })
      .catch((error) => {
        // console.log("Error in getOrderHistory", error);
      });
  }

  React.useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  React.useEffect(() => {
    getOrderHistory();

    //console.log("order hsitory in use effect", orderHistory);
  }, []);

  return (
    <View style={style.container}>
      <Text style={style.topText}>Order History</Text>
      <View style={style.dataTable}>
        <DataTable>
          <DataTable.Header>
            <View style={style.titleID}>
              <DataTable.Title>
                <Text style={style.rowText}>ID</Text>
              </DataTable.Title>
            </View>
            <View style={style.titleStatus}>
              <DataTable.Title>
                <Text style={style.rowText}>Status</Text>
              </DataTable.Title>
            </View>
            <View style={style.titleOrderData}>
              <DataTable.Title>
                <Text style={style.rowText}>Order Data</Text>
              </DataTable.Title>
            </View>
          </DataTable.Header>

          {orderHistory !== null
            ? slicedOrderHistory.map((row, i) => (
                <DataTable.Row
                  style={style.row}
                  key={i}
                >
                  <View style={style.idCell}>
                    <DataTable.Cell>
                      <Text style={style.tableText}>{row._id}</Text>
                    </DataTable.Cell>
                  </View>

                  <View style={style.statusCell}>
                    <DataTable.Cell>
                      <Text style={style.tableText}>{row.status}</Text>
                    </DataTable.Cell>
                  </View>

                  <View style={style.cell}>
                    <DataTable.Cell>
                      <Text style={style.tableText}>{row.orderData}</Text>
                    </DataTable.Cell>
                  </View>
                </DataTable.Row>
              ))
            : null}
        </DataTable>
      </View>

      {orderHistory !== null ? (
        <View style={style.pagContainer}>
          <DataTable.Pagination
            theme={theme}
            page={page}
            numberOfPages={Math.ceil(
              orderHistory.length / numberOfItemsPerPage
            )}
            onPageChange={(page) => {
              setPage(page);
            }}
            label={
              <Text style={style.pagText}>
                {from + 1}-{to} of {orderHistory.length}
              </Text>
            }
            showFastPaginationControls
          />
        </View>
      ) : null}
    </View>
  );
}
//`${from + 1}-${to} of ${orderHistory.length}`

const style = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",

    backgroundColor: "#0F3D3E"
  },
  topText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#E2DCC8",
    marginLeft: 15
    // textAlign: "center"
  },
  pagContainer: {
    alignItems: "center",
    backgroundColor: "#E2DCC8",
    height: 70,
    justifyContent: "center",
    color: "#0F3D3E",
    flex: 0.1
  },
  dataTable: {
    flex: 1
  },
  row: {
    //alignItems: "center"
  },
  tableText: {
    color: "#0F3D3E",
    fontSize: 10,
    fontWeight: "bold"
  },
  pagText: {
    color: "#0F3D3E",
    fontSize: 10,
    fontWeight: "bold"
  },
  rowText: {
    color: "#E2DCC8",
    fontSize: 20
  },
  cell: {
    borderColor: "#E2DCC8",
    borderWidth: 1,
    borderRadius: 5,
    width: 120,
    marginLeft: 20,
    marginBottom: 20,
    backgroundColor: "#E2DCC8",
    height: 20,
    alignItems: "center"
  },
  idCell: {
    borderColor: "#E2DCC8",
    borderWidth: 1,
    borderRadius: 5,
    width: 150,
    marginBottom: 20,
    backgroundColor: "#E2DCC8",
    height: 20,
    alignItems: "center"
  },
  statusCell: {
    width: 60,
    borderColor: "#E2DCC8",
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 20,
    marginBottom: 20,
    backgroundColor: "#E2DCC8",
    height: 20,
    alignItems: "center"
  },
  titleID: {},
  titleStatus: {
    marginLeft: 145
  },
  titleOrderData: {
    marginLeft: 25
  }
});
