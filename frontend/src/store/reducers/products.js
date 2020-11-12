import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const slice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
    lastFetch: null,
    product: { success: false },
    createdProduct: { product: {} },
    updateProduct: {},
    topRated: { list: [] },
  },
  reducers: {
    // GET TOP PRODUCTS
    PRODUCT_TOP_REQUEST: (products, action) => {
      products.topRated.loading = true;
    },
    PRODUCT_TOP_SUCCESS: (products, action) => {
      products.topRated.list = action.payload;
      products.topRated.loading = false;
      products.loading = false;
    },
    PRODUCT_TOP_FAIL: (products, action) => {
      products.topRated.error = action.payload;
      products.topRated.loading = false;
    },

    // GET PRODUCTS LIST
    PRODUCT_LIST_REQUEST: (products, action) => {
      products.loading = true;
    },
    PRODUCT_LIST_SUCCESS: (products, action) => {
      products.list = action.payload.products;
      products.page = action.payload.page;
      products.pages = action.payload.pages;

      products.loading = false;
    },
    PRODUCT_LIST_FAIL: (products, action) => {
      products.error = action.payload;
      products.loading = false;
    },

    // DELETE A PRODUCT
    PRODUCT_DELETE_REQUEST: (products, action) => {
      products.product.loading = true;
    },
    PRODUCT_DELETE_SUCCESS: (products, action) => {
      products.product.loading = false;
      products.product.success = true;
      const productId = action.payload;
      products.list = products.list.filter((x) => x._id !== productId);
    },
    PRODUCT_DELETE_FAIL: (products, action) => {
      products.product.error = action.payload;
      products.product.loading = false;
    },

    // CREATE A NEW PRODUCT
    PRODUCT_CREATE_REQUEST: (products, action) => {
      products.createdProduct.loading = true;
    },
    PRODUCT_CREATE_SUCCESS: (products, action) => {
      products.createdProduct.product = action.payload;
      products.createdProduct.loading = false;
      products.createdProduct.success = true;
    },
    PRODUCT_CREATE_FAIL: (products, action) => {
      products.createdProduct.error = action.payload;
      products.createdProduct.loading = false;
    },
    PRODUCT_CREATE_RESET: (products, action) => {
      products.createdProduct = {};
    },

    // UPDATE PRODUCT
    PRODUCT_UPDATE_REQUEST: (products, action) => {
      products.updateProduct.loading = true;
    },
    PRODUCT_UPDATE_SUCCESS: (products, action) => {
      products.updateProduct.loading = false;
      products.updateProduct.success = true;
      products.updateProduct.product = action.payload;
    },
    PRODUCT_UPDATE_FAIL: (products, action) => {
      products.updateProduct.error = action.payload;
      products.updateProduct.loading = false;
    },
    PRODUCT_UPDATE_RESET: (products, action) => {
      products.updateProduct = {};
    },
  },
});

const {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
} = slice.actions;

export const { PRODUCT_CREATE_RESET, PRODUCT_UPDATE_RESET } = slice.actions;
export default slice.reducer;

// Actions

export const loadProducts = (keyword = "", pageNumber = "") => async (
  dispatch
) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST.type });

    const { data } = await axios.get(
      `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
    ); // note that there is not a slash[/] after products coz of queryString

    dispatch({
      type: PRODUCT_LIST_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST.type,
    });

    await axios.delete(`/api/products/${id}`);

    dispatch({
      type: PRODUCT_DELETE_SUCCESS.type,
      payload: id,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    console.log(error, error.message);
  }
};

export const createProduct = () => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST.type,
    });

    const { data } = await axios.post(`/api/products/`, {});

    dispatch({
      type: PRODUCT_CREATE_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    console.log(error, error.message);
  }
};

export const updateProduct = (product) => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST.type,
    });

    const { data } = await axios.put(`/api/products/${product._id}`, product);

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    console.log(error, error.message);
  }
};

export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: PRODUCT_TOP_REQUEST.type,
    });

    const { data } = await axios.get(`/api/products/top`);

    dispatch({
      type: PRODUCT_TOP_SUCCESS.type,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL.type,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    console.log(error, error.message);
  }
};
