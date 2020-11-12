import { combineReducers } from "redux";
import productsList from "./reducers/products";
import productDetail from "./reducers/productDetails";
import cart from "./reducers/cart";
import auth from "./reducers/auth";
import user from "./reducers/user";
import profile from "./reducers/profile";
import orderPlace from "./reducers/order";
import orderDetails from "./reducers/orderDetails";
import orderPay from "./reducers/orderPay";
import myOrders from "./reducers/myOrders";
import admin from "./reducers/admin";

export default combineReducers({
  productsList,
  productDetail,
  cart,
  auth,
  user,
  profile,
  orderPlace,
  orderDetails,
  orderPay,
  myOrders,
  admin,
});
