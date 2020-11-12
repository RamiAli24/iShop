import React, { useEffect } from "react";
import { Col, Row, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import Product from "../components/product";
import { useDispatch, useSelector } from "react-redux";
import { loadProducts } from "../store/reducers/products";
import Meta from "../components/meta";
import Paginate from "./../components/paginate";
import ProductCarousel from "./../components/productCarousel";

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword;
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();
  const products = useSelector((state) => state.entities.productsList);
  const { loading, list, pages, page } = products;

  useEffect(() => {
    dispatch(loadProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  return (
    <>
      <Meta title="iShop" />
      {!keyword && <ProductCarousel />}
      {keyword && (
        <Link to="/" className="btn btn-secondary ">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {loading && <Alert variant="info">Loading....</Alert>}
      <Row>
        {list.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            {/* Everything other than key is styling  */}
            <Product product={product} />
          </Col>
        ))}
      </Row>
      <Paginate pages={pages} page={page} keyword={keyword ? keyword : ""} />
    </>
  );
};

export default HomeScreen;
