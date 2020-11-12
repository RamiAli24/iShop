import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Alert,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { addToCart, removeFromCart, setPrices } from "../store/reducers/cart";
import Meta from "../components/meta";

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.entities.cart);
  const { userInfo } = useSelector((state) => state.entities.auth);
  const { cartItems } = cart;

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty));
    }
  }, [dispatch, productId, qty]);

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };

  const itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 100);
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const checkOutHandler = () => {
    dispatch(setPrices(itemsPrice, shippingPrice, taxPrice, totalPrice));
  };

  return (
    <Row>
      <Meta title="Shopping Cart" />
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Alert variant="primary">
            Your cart is empty.
            <Link to="/" style={{ color: "black", marginLeft: "1rem" }}>
              Go back
            </Link>
          </Alert>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link
                      to={`/products/${item.product}`}
                      style={{ color: "black" }}
                    >
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup>
            <ListGroup.Item>
              <h3>
                SUBTOTAL ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                ITEMS
              </h3>
              <h5>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)}
              </h5>
            </ListGroup.Item>
          </ListGroup>
          <ListGroup>
            <Link to={userInfo ? "/shipping" : "/login"}>
              <Button
                className="btn-block grey"
                variant="dark"
                onClick={checkOutHandler}
                disabled={cartItems.length === 0}
              >
                PROCEED TO CHECKOUT
              </Button>
            </Link>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
