import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode from "jwt-decode";

const slice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    userInfo: localStorage.getItem("userInfo")
      ? jwtDecode(localStorage.getItem("userInfo"))
      : null,
    error: null,
  },
  reducers: {
    USER_LOGIN_REQUEST: (login, action) => {
      login.loading = true;
    },
    USER_LOGIN_SUCCESS: (login, action) => {
      login.loading = false;
      login.userInfo = action.payload;
    },
    USER_LOGIN_FAILED: (login, action) => {
      login.loading = false;
      login.error = action.payload;
    },
  },
});

const { USER_LOGIN_REQUEST, USER_LOGIN_FAILED } = slice.actions;

export const { USER_LOGIN_SUCCESS } = slice.actions;
export default slice.reducer;

// Actions

export const login = (email, password) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST.type });
    const { data } = await axios.post("/api/login", { email, password });

    dispatch({
      type: USER_LOGIN_SUCCESS.type,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAILED.type,
      payload: error,
    });
  }
};
