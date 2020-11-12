import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const slice = createSlice({
  name: "order_Pay",
  initialState: {},
  reducers: {
    ORDER_PAY_REQUEST: (order, action) => {
      order.loading = true;
    },
    ORDER_PAY_SUCCESS: (order, action) => {
      order.loading = false;
      order.success = true;
    },
    ORDER_PAY_FAIL: (order, action) => {
      order.loading = false;
      order.error = action.payload;
    },
    ORDER_PAY_RESET: (order, action) => {
      order = null;
    },
  },
});

const { ORDER_PAY_REQUEST, ORDER_PAY_SUCCESS, ORDER_PAY_FAIL } = slice.actions;
export const { ORDER_PAY_RESET } = slice.actions;

export default slice.reducer;

// Actions

export const payOrder = (orderId, paymentResult) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_PAY_REQUEST.type });
    const { data } = await axios.put(
      `/api/orders/${orderId}/pay`,
      paymentResult
    );

    dispatch({
      type: ORDER_PAY_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_PAY_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
