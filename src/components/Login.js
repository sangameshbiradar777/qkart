import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();

  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: ""
  })

  const [isSendingData, setIsSendingData] = useState(false);

  const setInputData = (e) => {
    setLoginFormData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value
      }
    })
  }

  const showSnackbar = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    if(!validateInput(formData)) return;

    // Show loader
    setIsSendingData(true);

    const URL = `${config.endpoint}/auth/login`;

    try {
      const {data} = await axios.post(URL, {
        username: formData.username,
        password: formData.password
      });

      showSnackbar('Logged in', 'success');

      // Store data in local storage after successful login
      persistLogin(data.token, data.username, data.balance);

      // Redirect to products page
      history.push('/', {hasHiddenAuthButtons: true});
    }
    catch(error) {
      const errorResponse = error.response;
      const errorData = errorResponse?.data;

      console.log(error.response);

      if(errorResponse.status === 400) {
        showSnackbar(errorData.message, 'error');
        // return;
      }
      else {
        showSnackbar('Something went wrong, check that the backend is running, reachable and returns valid JSON');
      }
    }
    finally {
      setIsSendingData(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if(!data.username) {
      showSnackbar('Username is a required field', 'warning');
      return false;
    }
    else if(!data.password) {
      showSnackbar('Password is a required field', 'warning');
      return false;
    }

    return true;
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */

  const setItemToLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
  }

  const persistLogin = (token, username, balance) => {
    setItemToLocalStorage('token', token);
    setItemToLocalStorage('username', username);
    setItemToLocalStorage('balance', balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            name="username"
            title="Username"
            placeholder="Enter username"
            variant="outlined"
            onChange={setInputData}
            fullWidth
          />
          <TextField
            id="password"
            label="Password"
            name="password"
            placeholder="Enter password"
            type="password"
            variant="outlined"
            onChange={setInputData}
            fullWidth
          />
          <Button className="button" variant="contained" name="login" onClick={()=> login(loginFormData)}>
            {isSendingData ? <CircularProgress sx={{color: 'white'}} /> : 'Login to Qkart'}
          </Button>
          <p className="secondary-action">
            Dont have an account?{"  "}
            <Link className="link" to='/register'>Register now</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
