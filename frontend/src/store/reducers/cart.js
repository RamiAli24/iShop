import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const slice = createSlice({
  name: "cart",
  initialState: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],

    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress"))
      : {},
    paymentMethod: null,
  },
  reducers: {
    CART_ADD_ITEM: (cart, action) => {
      const item = action.payload;

      const index = cart.cartItems.findIndex((x) => x.product === item.product);

      //i wrote like that cause -1 is what it returns when not found and -1 is truthy
      //remember immer is running under the hood,code MUST be immutable
      if (index !== -1) {
        cart.cartItems[index] = { ...item };
      } else {
        cart.cartItems.push({ ...item });
      }
    },

    CART_REMOVE_ITEM: (cart, action) => {
      const id = action.payload;
      const index = cart.cartItems.findIndex((x) => x.product === id);

      // cart.cartItems.splice(index, 1);
      cart.cartItems = cart.cartItems.filter((x) => x.product !== id);
    },

    CART_SAVE_SHIPPING_ADDRESS: (cart, action) => {
      cart.shippingAddress = action.payload;
    },
    CART_SAVE_PAYMENT_METHOD: (cart, action) => {
      cart.paymentMethod = action.payload;
    },
    CART_SAVE_PRICES: (cart, action) => {
      cart.itemsPrice = action.payload.itemsPrice;
      cart.shippingPrice = action.payload.shippingPrice;
      cart.taxPrice = action.payload.taxPrice;
      cart.totalPrice = action.payload.totalPrice;
    },
  },
});

const {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD,
  CART_SAVE_PRICES,
} = slice.actions;
export default slice.reducer;

// Actions

// LocalHost prefix is configured in package.json

export const addToCart = (id, qty) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
      type: CART_ADD_ITEM.type,
      payload: {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().entities.cart.cartItems)
    );
  } catch (error) {
    console.log(error, error.message);
  }
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM.type,
    payload: id,
  });
  localStorage.setItem(
    "cartItems",
    JSON.stringify(getState().entities.cart.cartItems)
  );
};

export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_SHIPPING_ADDRESS.type,
    payload: data,
  });
  localStorage.setItem("shippingAddress", JSON.stringify(data));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: CART_SAVE_PAYMENT_METHOD.type,
    payload: data,
  });

  localStorage.setItem("paymentMethod", JSON.stringify(data));
};

//notice that when creating both actions,we make sure that the local storage is in sync with the store
// thats very IMPORTANT
export const setPrices = (itemsPrice, shippingPrice, taxPrice, totalPrice) => (
  dispatch
) => {
  dispatch({
    type: CART_SAVE_PRICES.type,
    payload: { itemsPrice, shippingPrice, taxPrice, totalPrice },
  });
};
