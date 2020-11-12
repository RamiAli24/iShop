import axios from "axios";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log(error);
  }

  return Promise.reject(error);
});

// for when calling protected routes we make sure to surpass the auth middleware if logged in
export function setJwtAuth(jwt) {
  axios.defaults.headers.common["userInfo"] = JSON.parse(jwt);
}
