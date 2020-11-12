import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/reducers/user";
import Meta from "../components/meta";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const userRegister = useSelector((state) => state.entities.user);
  const { loading, error, userInfo } = userRegister;
  const dispatch = useDispatch();

  //if user is already logged in, wa should redirect him
  useEffect(() => {
    if (userInfo) {
      window.location = "/";
    }
  }, [message, userInfo, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <div>
      <Meta title="Sign Up" />
      <Form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {error && <Alert variant="danger">Invalid Email or Password</Alert>}
        {message && <Alert variant="danger">{message}</Alert>}

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

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

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
        <h6 className="py-3">
          Have an Account?
          <Link to="/login" style={{ color: "gray", paddingLeft: "1rem " }}>
            Login
          </Link>
        </h6>
      </Form>
    </div>
  );
};

export default RegisterScreen;
