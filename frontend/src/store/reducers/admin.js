import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { USER_PROFILE_SUCCESS } from "./profile";

const slice = createSlice({
  name: "admin",
  initialState: {
    userList: [],
    loading: false,
    user: {},
    orders: { list: [] },
    deliver: {},
  },
  reducers: {
    // Getting users list
    USER_LIST_REQUEST: (users, action) => {
      users.loading = true;
    },
    USER_LIST_SUCCESS: (users, action) => {
      users.userList = action.payload;
      users.loading = false;
    },
    USER_LIST_FAIL: (users, action) => {
      users.error = action.payload;
      users.loading = false;
    },
    USER_LIST_RESET: (users, action) => {
      users.userList = [];
    },

    // Deleting a single user
    USER_DELETE_REQUEST: (users, action) => {
      users.loading = true;
    },
    USER_DELETE_SUCCESS: (users, action) => {
      const userId = action.payload;
      users.userList = users.userList.filter((x) => x._id !== userId);
      users.successDelete = true;
    },
    USER_DELETE_FAIL: (users, action) => {
      users.error = action.payload;
      users.loading = false;
    },

    //Updating a single user
    USER_UPDATE_REQUEST: (users, action) => {
      users.user.loading = true;
    },
    USER_UPDATE_SUCCESS: (users, action) => {
      users.user.loading = false;
      users.user.success = true;
    },
    USER_UPDATE_FAIL: (users, action) => {
      users.error = action.payload;
      users.loading = false;
    },
    USER_UPDATE_RESET: (users, action) => {
      users.user = {};
    },

    // Getting All orders with their respective users
    ORDER_LIST_REQUEST: (users, action) => {
      users.orders.loading = true;
    },
    ORDER_LIST_SUCCESS: (users, action) => {
      users.orders.loading = false;
      users.orders.success = true;
      users.orders.list = action.payload;
    },
    ORDER_LIST_FAIL: (users, action) => {
      users.orders.error = action.payload;
      users.orders.loading = false;
    },

    // setting  order to delivered
    ORDER_DELIVER_REQUEST: (users, action) => {
      users.orders.loading = true;
    },
    ORDER_DELIVER_SUCCESS: (users, action) => {
      users.deliver.loading = false;
      users.deliver.success = true;
    },
    ORDER_DELIVER_FAIL: (users, action) => {
      users.deliver.error = action.payload;
      users.deliver.loading = false;
    },
    ORDER_DELIVER_RESET: (users, action) => {
      users.deliver = {};
    },
  },
});

const {
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL,
} = slice.actions;

export const {
  USER_LIST_RESET,
  USER_UPDATE_RESET,
  ORDER_DELIVER_RESET,
} = slice.actions;
export default slice.reducer;

// Actions

export const listUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: USER_LIST_REQUEST.type,
    });

    const { data } = await axios.get(`/api/users/`);

    dispatch({
      type: USER_LIST_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({
      type: USER_DELETE_REQUEST.type,
    });

    await axios.delete(`/api/users/${id}`);

    dispatch({
      type: USER_DELETE_SUCCESS.type,
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUser = (user) => async (dispatch) => {
  try {
    dispatch({
      type: USER_UPDATE_REQUEST.type,
    });

    const { data } = await axios.put(`/api/users/${user._id}`, user);

    dispatch({ type: USER_UPDATE_SUCCESS.type });
    dispatch({ type: USER_PROFILE_SUCCESS.type, payload: data }); // to also update the user's profile
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listOrders = () => async (dispatch) => {
  try {
    dispatch({
      type: ORDER_LIST_REQUEST.type,
    });

    const { data } = await axios.get(`/api/orders/`);

    dispatch({
      type: ORDER_LIST_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deliverOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({
      type: ORDER_DELIVER_REQUEST.type,
    });

    const { data } = await axios.put(`/api/orders/${order._id}/deliver`, {});

    dispatch({
      type: ORDER_DELIVER_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message;

    dispatch({
      type: ORDER_DELIVER_FAIL.type,
      payload: message,
    });
  }
};
