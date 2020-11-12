import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const slice = createSlice({
  name: "My-Orders",
  initialState: { orders: [] },
  reducers: {
    MY_ORDERS_REQUEST: (order, action) => {
      order.loading = true;
    },
    MY_ORDERS_SUCCESS: (order, action) => {
      order.loading = false;
      order.orders = action.payload;
    },
    MY_ORDERS_FAIL: (order, action) => {
      order.loading = false;
      order.error = action.payload;
    },
  },
});

const { MY_ORDERS_REQUEST, MY_ORDERS_SUCCESS, MY_ORDERS_FAIL } = slice.actions;
export const { MY_ORDERS_RESET } = slice.actions;

export default slice.reducer;

// Actions

export const listMyOrders = () => async (dispatch) => {
  // we dont have to input ID as a param as its know who we are grom auth token
  try {
    dispatch({ type: MY_ORDERS_REQUEST.type });
    const { data } = await axios.get("/api/orders/myorders");

    dispatch({
      type: MY_ORDERS_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: MY_ORDERS_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
