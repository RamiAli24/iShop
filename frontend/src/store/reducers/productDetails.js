import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const slice = createSlice({
  name: "productDetail",
  initialState: {
    details: { reviews: [] },
    loading: false,
    review: {},
  },
  reducers: {
    PRODUCT_DETAIL_REQUEST: (product, action) => {
      product.loading = true;
    },
    PRODUCT_DETAIL_SUCCESS: (product, action) => {
      product.loading = false;
      product.details = action.payload;
    },
    PRODUCT_DETAIL_FAIL: (product, action) => {
      product.error = action.payload;
      product.loading = false;
    },

    // Create a Product Review
    PRODUCT_CREATE_REVIEW_REQUEST: (products, action) => {
      products.review.loading = true;
    },
    PRODUCT_CREATE_REVIEW_SUCCESS: (products, action) => {
      products.review.loading = false;
      products.review.success = true;
    },
    PRODUCT_CREATE_REVIEW_FAIL: (products, action) => {
      products.review.error = action.payload;
      products.review.loading = false;
    },
    PRODUCT_CREATE_REVIEW_RESET: (products, action) => {
      products.review = {};
    },
  },
});

const {
  PRODUCT_DETAIL_REQUEST,
  PRODUCT_DETAIL_FAIL,
  PRODUCT_DETAIL_SUCCESS,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
} = slice.actions;

export const { PRODUCT_CREATE_REVIEW_RESET } = slice.actions;
export default slice.reducer;

// Actions

export const loadProductDetail = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: PRODUCT_DETAIL_REQUEST.type });

    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
      type: PRODUCT_DETAIL_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAIL_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createProductReview = (productId, review) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_REQUEST.type,
    });

    await axios.post(`/api/products/${productId}/reviews`, review);

    dispatch({
      type: PRODUCT_CREATE_REVIEW_SUCCESS.type,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
