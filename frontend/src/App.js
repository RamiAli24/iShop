import React from "react";
import "./App.css";
import { Container } from "react-bootstrap";
import Header from "./components/header";
import Footer from "./components/footer";
import HomeScreen from "./screens/homeScreen";
import { Route, Switch } from "react-router-dom";
import ProductScreen from "./screens/productScreen";
import CartScreen from "./screens/cartScreen";
import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/registerScreen";
import ProfileScreen from "./screens/profileScreen";
import { setJwtAuth } from "./services/httpService";
import ShippingScreen from "./screens/shippingScreen";
import PaymentScreen from "./screens/paymentScreen";
import PlaceOrderScreen from "./screens/placeOrderScreen";
import OrderScreen from "./screens/orderScreen";
import UserListScreen from "./screens/userListScreen";
import UserEditScreen from "./screens/userEditScreen";
import ProductListScreen from "./screens/productListScreen";
import ProductEditScreen from "./screens/productEditScreen";
import OrderListScreen from "./screens/orderListScreen";

setJwtAuth(localStorage.getItem("userInfo")); // for calling auth routes when logged in

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <Container>
          <Switch>
            <Route
              path="/admin/product/:id/edit"
              component={ProductEditScreen}
            />
            <Route path="/admin/user/:id" component={UserEditScreen} />
            <Route
              path="/admin/productlist"
              component={ProductListScreen}
              exact
            />
            <Route
              path="/admin/productlist/:pageNumber"
              component={ProductListScreen}
              exact
            />
            <Route path="/admin/orderlist" component={OrderListScreen} />
            <Route path="/admin/userlist" component={UserListScreen} />
            <Route path="/products/:id" component={ProductScreen} />
            <Route path="/cart/:id?" component={CartScreen} />
            <Route path="/order/:id" component={OrderScreen} />
            <Route path="/search/:keyword" component={HomeScreen} />
            <Route path="/page/:pageNumber" component={HomeScreen} exact />
            <Route
              path="/search/:keyword/page/:pageNumber"
              component={HomeScreen}
              exact
            />
            <Route path="/placeorder" component={PlaceOrderScreen} />
            <Route path="/shipping" component={ShippingScreen} />
            <Route path="/payment" component={PaymentScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/login" component={LoginScreen} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/" exact component={HomeScreen} />
          </Switch>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default App;
