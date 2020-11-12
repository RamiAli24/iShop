import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const slice = createSlice({
  name: "order_details",
  initialState: { loading: true },
  reducers: {
    ORDER_DETAILS_REQUEST: (order, action) => {
      order.loading = true;
    },
    ORDER_DETAILS_SUCCESS: (order, action) => {
      order.loading = false;
      order.success = true;
      order.error = false;

      order.self = action.payload;
    },
    ORDER_DETAILS_FAIL: (order, action) => {
      order.loading = false;
      order.error = action.payload;
    },
  },
});

const {
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
} = slice.actions;
export default slice.reducer;

// Actions

export const getOrderDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_DETAILS_REQUEST.type });
    const { data } = await axios.get(`/api/orders/${id}`);

    dispatch({
      type: ORDER_DETAILS_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
