import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { USER_LOGIN_SUCCESS } from "./auth";

const slice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    user: {},
    error: null,
    success: false,
    update: {},
  },
  reducers: {
    USER_PROFILE_REQUEST: (profile, action) => {
      profile.loading = true;
    },
    USER_PROFILE_SUCCESS: (profile, action) => {
      profile.loading = false;
      profile.user = action.payload;
    },
    USER_PROFILE_FAILED: (profile, action) => {
      profile.loading = false;
      profile.error = action.payload;
    },

    //USER PROFILE UPDATE
    USER_UPDATE_REQUEST: (profile, action) => {
      profile.update.loading = true;
    },
    USER_UPDATE_SUCCESS: (profile, action) => {
      profile.update.loading = false;
      profile.update.success = true;
      profile.update.user = action.payload;
    },
    USER_UPDATE_FAILED: (profile, action) => {
      profile.update.loading = false;
      profile.update.error = action.payload;
    },
    USER_UPDATE_RESET: (profile, action) => {
      profile.update = {};
    },
  },
});

const {
  USER_PROFILE_REQUEST,
  USER_PROFILE_FAILED,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAILED,
} = slice.actions;

export const { USER_PROFILE_SUCCESS, USER_UPDATE_RESET } = slice.actions; // we use it in the admin reducer after dispatching a user update via admin
export default slice.reducer;

// Actions

export const getUserDetails = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST.type });

    const { data } = await axios.get("/api/users/profile");

    dispatch({
      type: USER_PROFILE_SUCCESS.type,
      payload: data,
    });

    dispatch({
      type: USER_LOGIN_SUCCESS.type,
      payload: data,
    });

    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAILED.type,
      payload: error,
    });
  }
};

export const updateUserDetails = (user) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_UPDATE_REQUEST.type });

    const { data } = await axios.put("/api/users/profile", { ...user });

    dispatch({
      type: USER_UPDATE_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_UPDATE_FAILED.type,
      payload: error,
    });
  }
};

export const getUserDetailsForAdmin = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_PROFILE_REQUEST.type });

    const { data } = await axios.get(`/api/users/${id}`);

    dispatch({
      type: USER_PROFILE_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_PROFILE_FAILED.type,
      payload: error,
    });
  }
};
