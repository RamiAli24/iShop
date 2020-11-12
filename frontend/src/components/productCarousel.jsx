import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Carousel, Image, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listTopProducts } from "../store/reducers/products";

const ProductCarousel = () => {
  const dispatch = useDispatch();

  const productTopRated = useSelector((state) => state.entities.productsList);
  const { loading, error, list: products } = productTopRated.topRated;

  useEffect(() => {
    dispatch(listTopProducts());
  }, [dispatch]);

  return loading ? (
    <Alert variant="info">Loading....</Alert>
  ) : error ? (
    <Alert variant="danger">{error}</Alert>
  ) : (
    <Carousel pause="hover" className="bg-dark">
      {products.map((product) => (
        <Carousel.Item key={product._id}>
          <Link to={`/products/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid />
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ProductCarousel;
