import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PayPalButton } from "react-paypal-button-v2";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  Alert,
  Button,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../store/reducers/orderDetails";
import { payOrder, ORDER_PAY_RESET } from "../store/reducers/orderPay";
import { ORDER_DELIVER_RESET, deliverOrder } from "../store/reducers/admin";

const OrderScreen = ({ match }) => {
  const orderId = match.params.id;
  const dispatch = useDispatch();
  const [sdkReady, setSdkReady] = useState(false);

  const orderDetails = useSelector((state) => state.entities.orderDetails);

  const user = useSelector((state) => state.entities.auth);
  const { userInfo } = user;

  const orderPay = useSelector((state) => state.entities.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.entities.admin);
  const {
    loading: loadingDeliver,
    success: successDeliver,
  } = orderDeliver.deliver;

  useEffect(() => {
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
      script.async = true;
      script.onload = () => {
        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (
      !orderDetails.self ||
      successPay ||
      successDeliver ||
      orderDetails.self._id !== orderId
    ) {
      dispatch({ type: ORDER_PAY_RESET.type });
      // dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!orderDetails.self.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, orderId, successPay, orderDetails.self, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(orderDetails.self));
  };

  //you will get an error if we dont check the existence of [orderDetails.self] before returning, as its not instantiated in initialState
  return orderDetails && orderDetails.self ? (
    <>
      {" "}
      <h1>Order {orderDetails.self._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <br />
              <p>
                <strong>Name: </strong> {orderDetails.self.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a
                  href={`mailto:${orderDetails.self.user.email}`}
                  style={{ color: "black" }}
                >
                  {orderDetails.self.user.email}
                </a>
              </p>{" "}
              <p>
                <strong>Address: </strong>
                {orderDetails.self.shippingAddress.address},{" "}
                {orderDetails.self.shippingAddress.city}{" "}
                {orderDetails.self.shippingAddress.postalCode},{" "}
                {orderDetails.self.shippingAddress.country}
              </p>{" "}
              {orderDetails.self.isDelivered ? (
                <Alert variant="success">
                  Delivered on {orderDetails.self.deliveredAt}
                </Alert>
              ) : (
                <Alert variant="danger">Not Delivered</Alert>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {orderDetails.self.paymentMethod}
              </p>
              {orderDetails.self.isPaid ? (
                <Alert variant="success">
                  Paid on {orderDetails.self.paidAt}
                </Alert>
              ) : (
                <Alert variant="danger">Not Paid</Alert>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order items </h2>
              {orderDetails.self.orderItems.length === 0 ? (
                <h2>Order is empty</h2>
              ) : (
                <ListGroup variant="flush">
                  {orderDetails.self.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col sm={2}>
                          <Image src={item.image} fluid rounded />
                        </Col>
                        <Col>
                          <Link
                            to={`/products/${item.product}`}
                            style={{ color: "black" }}
                          >
                            {item.name}
                          </Link>
                        </Col>
                        <Col>
                          {item.qty} x ${item.price} = $
                          {Number(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${orderDetails.self.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${orderDetails.self.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${orderDetails.self.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${orderDetails.self.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!orderDetails.self.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <h2>Loading....</h2>}
                  {!sdkReady ? (
                    <h2>Loading....</h2>
                  ) : (
                    <PayPalButton
                      amount={orderDetails.self.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <h1>Loading.....</h1>}
            {userInfo &&
              userInfo.isAdmin &&
              orderDetails.self.isPaid &&
              !orderDetails.self.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverHandler}
                  >
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <Alert variant="info">Loading.....</Alert>
  );
};

export default OrderScreen;
