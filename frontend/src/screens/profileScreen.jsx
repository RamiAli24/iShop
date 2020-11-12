import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Alert, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetails,
  updateUserDetails,
  USER_UPDATE_RESET,
} from "../store/reducers/profile";
import { listMyOrders } from "../store/reducers/myOrders";
import { LinkContainer } from "react-router-bootstrap";
import Meta from "../components/meta";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.entities.profile);
  const { loading, error, user } = userDetails;

  const userUpdateProfile = useSelector((state) => state.entities.profile);
  const { success } = userUpdateProfile.update;

  const userLogin = useSelector((state) => state.entities.auth);
  const { userInfo } = userLogin;

  const myOrdersList = useSelector((state) => state.entities.myOrders);
  const { loading: loadingOrders, error: errorOrders, orders } = myOrdersList;

  //if user is already logged in, we should redirect him
  useEffect(() => {
    dispatch(listMyOrders());
    if (!userInfo) {
      window.location = "/login";
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_RESET.type });
        dispatch(getUserDetails());

        setName(user.name);
        setEmail(user.email);
      }
      setName(user.name);
      setEmail(user.email);
    }
  }, [message, userInfo, dispatch, user, success]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      setMessage(null);
      dispatch(updateUserDetails({ _id: user._id, password, email, name }));
    }
  };

  return (
    <Row>
      <Meta title="Profile" />
      <Col md={3}>
        <Form onSubmit={handleSubmit}>
          <h2>User Profile</h2>
          {error && <Alert variant="danger">Invalid Email or Password</Alert>}
          {message && <Alert variant="danger">{message}</Alert>}
          {!message && !error && success && (
            <Alert variant="success">Profile updated</Alert>
          )}
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingOrders ? (
          <h2>Loading......</h2>
        ) : errorOrders ? (
          <h2 variant="danger">{errorOrders}</h2>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button className="btn-sm" variant="light">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
