import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button, Row, Col, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Meta from "../components/meta";
import {
  loadProducts,
  deleteProduct,
  createProduct,
} from "../store/reducers/products";
import { PRODUCT_CREATE_RESET } from "../store/reducers/products";
import Paginate from "./../components/paginate";

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;

  const dispatch = useDispatch();

  const productsList = useSelector((state) => state.entities.productsList);
  const { loading, error, list: products, page, pages } = productsList;

  const product = useSelector((state) => state.entities.productsList);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = product.product;

  const productCreate = useSelector((state) => state.entities.productsList);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate.createdProduct;

  const userLogin = useSelector((state) => state.entities.auth);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET.type });

    if (!userInfo || !userInfo.isAdmin) {
      history.push("/login");
    }

    if (successCreate) {
      history.push(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(loadProducts("", pageNumber));
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteProduct(id));
    }
    dispatch({ type: PRODUCT_CREATE_RESET.type });
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  return (
    <>
      <Meta title="Products" />
      <Row className="align-items-center">
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="text-right">
          <Button className="my-3" onClick={createProductHandler}>
            <i className="fas fa-plus"></i> Create Product
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Alert variant="info">Loading...</Alert>}
      {errorDelete && <Alert variant="danger">{errorDelete}</Alert>}
      {loadingCreate && <Alert variant="info">Loading...</Alert>}
      {errorCreate && <Alert variant="danger">{errorCreate}</Alert>}
      {loading ? (
        <Alert variant="info">Loading...</Alert>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/product/${product._id}/edit`}>
                      <Button variant="light" className="btn-sm">
                        <i className="fas fa-edit"></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="danger"
                      className="btn-sm"
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  );
};

export default ProductListScreen;
