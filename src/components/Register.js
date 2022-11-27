import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();

  const history = useHistory();

  const [registrationFormData, setRegistrationFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [isSendingData, setIsSendingData] = useState(false);

  const setInputData = (e) => {
    setRegistrationFormData((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  const showSnackbar = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    if (!validateInput(formData)) return;

    // Show loader
    setIsSendingData(true);

    try {
      const url = `${config.endpoint}/auth/register`;
      const response = await axios.post(url, {
        username: formData.username,
        password: formData.password,
      });

      if (response.status >= 200 && response.status <= 299) {
        showSnackbar("Registered successfully", "success");

        // Redirect to login page
        history.push('/login');
      }
    } catch (error) {
      const errorResponse = error.response;
      const errorData = error.response.data;

      if (errorResponse?.status >= 400 && errorResponse?.status <= 499) {
        showSnackbar(errorData?.message, "error");
        return;
      }

      showSnackbar(
        "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
        "error"
      );
    } finally {
      // Hide the loader
      setIsSendingData(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = ({ username, password, confirmPassword }) => {
    if (!username) {
      showSnackbar("Username is a required field", "warning");
      return false;
    } else if (username.length < 6) {
      showSnackbar("Username must be at least 6 characters", "warning");
      return false;
    } else if (!password) {
      showSnackbar("Password is a required field", "warning");
      return false;
    } else if (password.length < 6) {
      showSnackbar("Password must be at least 6 characters", "warning");
      return false;
    } else if (password !== confirmPassword) {
      showSnackbar("Passwords do not match", "error");
      return false;
    }

    return true;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            value={registrationFormData.username}
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            onChange={setInputData}
            fullWidth
          />
          <TextField
            id="password"
            value={registrationFormData.password}
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            onChange={setInputData}
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            value={registrationFormData.confirmPassword}
            variant="outlined"
            onChange={setInputData}
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
          />

          <Button
            className="button"
            variant="contained"
            name="register"
            onClick={() => register(registrationFormData)}
          >
            {isSendingData ? (
              <CircularProgress sx={{ color: "white" }} />
            ) : (
              "Register Now"
            )}
          </Button>
          <p className="secondary-action">
            Already have an account?{"  "}
            <Link className="link" to='/login'>Login to qkart</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
