import React from "react";
import { Card } from "react-bootstrap";
import Rating from "./rating";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    //  margin y-axis  and   padding all around
    <Card className="my-3 p-3 rounded">
      <Link to={`/products/${product._id}`}>
        <Card.Img variant="top" src={product.image} />
      </Link>
      <Card.Body>
        <Link to={`/products/${product._id}`}>
          <Card.Title as="div">
            <strong style={{ color: "#243136" }}>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text>
        <Card.Text as="h3">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Product;
