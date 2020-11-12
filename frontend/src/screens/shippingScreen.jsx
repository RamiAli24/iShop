import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../store/reducers/cart";
import CheckoutSteps from "./../components/checkoutSteps";

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.entities.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    history.push("/payment");
  };

  return (
    <Form onSubmit={submitHandler}>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form.Group controlId="address">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter address"
          value={address}
          required
          onChange={(e) => setAddress(e.currentTarget.value)}
        />
      </Form.Group>

      <Form.Group controlId="city">
        <Form.Label>City</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter city"
          value={city}
          required
          onChange={(e) => setCity(e.currentTarget.value)}
        />
      </Form.Group>

      <Form.Group controlId="postalCode">
        <Form.Label>Postal Code</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter postal code"
          value={postalCode}
          required
          onChange={(e) => setPostalCode(e.currentTarget.value)}
        />
      </Form.Group>

      <Form.Group controlId="country">
        <Form.Label>Country</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter address"
          value={country}
          required
          onChange={(e) => setCountry(e.currentTarget.value)}
        />
      </Form.Group>

      <Button type="submit" variant="primary">
        Continue
      </Button>
    </Form>
  );
};

export default ShippingScreen;
