import { createSlice } from "@reduxjs/toolkit/";

const initialState = {
  origin: null,
  destination: null,
  travelTimeInformation: null,
  loggedState: null,
  activeOrder: null,
  availableCollection: null,
  activeOrderDetail: null,
  orderHistory: null
};

export const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    setOrigin: (state, action) => {
      state.origin = action.payload;
    },
    setDestination: (state, action) => {
      state.destination = action.payload;
    },
    setTravelTimeInformation: (state, action) => {
      state.travelTimeInformation = action.payload;
    },
    setLoggedState: (state, action) => {
      console.log(
        "action payload logged state",
        action.payload,
        "state",
        state
      );
      state.loggedState = action.payload;
    },
    setActiveOrder: (state, action) => {
      console.log(
        "action payload logged state",
        action.payload,
        "state",
        state
      );
      state.activeOrder = action.payload;
    },
    setAvailableCollection: (state, action) => {
      console.log(
        "action payload logged state",
        action.payload,
        "state",
        state
      );
      state.availableCollection = action.payload;
    },
    setActiveOrderDetail: (state, action) => {
      console.log(
        "action payload logged state",
        action.payload,
        "state",
        state
      );
      state.activeOrderDetail = action.payload;
    },
    setOrderHistory: (state, action) => {
      console.log(
        "action payload order history",
        action.payload,
        "state",
        state
      );
      state.orderHistory = action.payload;
    }
  }
});

export const {
  setOrigin,
  setDestination,
  setTravelTimeInformation,
  setLoggedState,
  setActiveOrder,
  setAvailableCollection,
  setActiveOrderDetail,
  setOrderHistory
} = navSlice.actions;

export const selectOrigin = (state) => state.nav.origin;
export const selectDestination = (state) => state.nav.destination;
export const selectTravelTimeInformation = (state) =>
  state.nav.travelTimeInformation;
export const selectLoggedState = (state) => state.nav.loggedState;
export const selectActiveOrder = (state) => state.nav.activeOrder;
export const selectAvailableCollection = (state) =>
  state.nav.availableCollection;
export const selectActiveOrderDetail = (state) => state.nav.activeOrderDetail;
export const selectOrderHistory = (state) => state.nav.orderHistory;

export default navSlice.reducer;
