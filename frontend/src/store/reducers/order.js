import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const slice = createSlice({
  name: "order",
  initialState: {},
  reducers: {
    ORDER_CREATE_REQUEST: (order, action) => {
      order.loading = true;
    },
    ORDER_CREATE_SUCCESS: (order, action) => {
      order.loading = false;
      order.success = true;
      order.self = action.payload;
    },
    ORDER_CREATE_FAIL: (order, action) => {
      order.loading = false;
      order.error = action.payload;
    },
  },
});

const {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
} = slice.actions;
export default slice.reducer;

// Actions

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST.type });
    const { data } = await axios.post("/api/orders", order);

    dispatch({
      type: ORDER_CREATE_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
