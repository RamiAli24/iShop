import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/reducers/auth";
import Meta from "../components/meta";

const LoginScreen = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userLogin = useSelector((state) => state.entities.auth);
  const { loading, error, userInfo } = userLogin;
  const dispatch = useDispatch();

  //if user is already logged in, wa should redirect him
  useEffect(() => {
    if (userInfo) {
      window.location = "/";
    }
  }, [history, userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <div>
      <Meta title="Log in to iShop" />
      <Form onSubmit={handleSubmit}>
        <h1>Sign In</h1>
        {error && <Alert variant="danger">Invalid Email or Password</Alert>}
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
        <h6 className="py-3">
          New Customer?
          <Link to="/register" style={{ color: "gray", paddingLeft: "1rem " }}>
            Sign Up
          </Link>
        </h6>
      </Form>
    </div>
  );
};

export default LoginScreen;
