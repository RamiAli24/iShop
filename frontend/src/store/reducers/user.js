import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import jwtDecode from "jwt-decode";

const slice = createSlice({
  name: "register",
  initialState: {
    loading: false,
    userInfo: localStorage.getItem("userInfo")
      ? jwtDecode(localStorage.getItem("userInfo"))
      : null,
    error: null,
  },
  reducers: {
    USER_REGISTER_REQUEST: (register, action) => {
      register.loading = true;
    },
    USER_REGISTER_SUCCESS: (register, action) => {
      register.loading = false;
      register.userInfo = action.payload;
    },
    USER_REGISTER_FAILED: (register, action) => {
      register.loading = false;
      register.error = action.payload;
    },
  },
});

const {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAILED,
} = slice.actions;
export default slice.reducer;

// Actions

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST.type });
    const { data } = await axios.post("/api/users", { name, email, password });

    dispatch({
      type: USER_REGISTER_SUCCESS.type,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAILED.type,
      payload: error,
    });
  }
};
