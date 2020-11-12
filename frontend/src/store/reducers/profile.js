import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const slice = createSlice({
  name: "profile",
  initialState: {
    loading: false,
    user: {},
    error: null,
    success: false,
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
    USER_UPDATE_REQUEST: (update, action) => {
      update.loading = true;
    },
    USER_UPDATE_SUCCESS: (update, action) => {
      update.loading = false;
      update.success = true;
      update.user = action.payload;
    },
    USER_UPDATE_FAILED: (update, action) => {
      update.loading = false;
      update.error = action.payload;
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

export const { USER_PROFILE_SUCCESS } = slice.actions; // we use it in the admin reducer after dispatching a user update via admin
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
