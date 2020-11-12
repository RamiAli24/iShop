import React, { useState, useEffect } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import CheckoutSteps from "../components/checkoutSteps";
import { savePaymentMethod } from "../store/reducers/cart";

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.entities.cart);
  const { shippingAddress } = cart;

  if (!shippingAddress) {
    history.push("/shipping");
  }

  const [paymentMethod, setPaymentMethod] = useState("PayPal");
  const [disable, setDisable] = useState(true);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    history.push("/placeorder");
  };

  const handleClick = () => {
    setDisable(false);
  };

  return (
    <Form onSubmit={submitHandler}>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form.Group>
        <Form.Label as="legend">Select Method</Form.Label>
        <Col>
          <Form.Check
            type="radio"
            label="PayPal or Credit Card"
            id="PayPal"
            name="paymentMethod"
            value="PayPal"
            onChange={(e) => setPaymentMethod(e.target.value)}
            onClick={handleClick}
          ></Form.Check>
          {/* <Form.Check
              type='radio'
              label='Stripe'
              id='Stripe'
              name='paymentMethod'
              value='Stripe'
              onChange={(e) => setPaymentMethod(e.target.value)}
            ></Form.Check> */}
        </Col>
      </Form.Group>

      <Button type="submit" variant="primary" disabled={disable}>
        Continue
      </Button>
    </Form>
  );
};

export default PaymentScreen;
