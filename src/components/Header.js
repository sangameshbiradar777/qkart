import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory, Link } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const username = localStorage.getItem("username");

  const history = useHistory();

  const goToProductsPage = () => {
    history.push("/");
  };

  const goToLoginPage = () => {
    history.push("/login");
  };

  const goToRegistrationPage = () => {
    history.push("/register");
  };

  const removeItemsFromLocalStorage = (key) => {
    localStorage.removeItem(key);
  };

  const logout = () => {
    removeItemsFromLocalStorage("username");
    removeItemsFromLocalStorage("token");
    removeItemsFromLocalStorage("balance");

    // Removing the items from local doesn't re render the page, so do a hard reload
    window.location.reload();
  };

  let headerAction;

  if (hasHiddenAuthButtons) {
    headerAction = (
      <Button
        className="explore-button"
        startIcon={<ArrowBackIcon />}
        variant="text"
        onClick={goToProductsPage}
      >
        Back to explore
      </Button>
    );
  } else if (username) {
    headerAction = (
      <Stack direction="row" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={.5}>
          {/* <Avatar sx={{ bgcolor: '#a36772', width: 35, height: 35}} alt={username}>{username.charAt(0).toUpperCase()}</Avatar> */}
          <img src="avatar.png" alt={username} width='35px' height={'35px'} />
          <span className="username-text">{username.charAt(0).toUpperCase().concat(username.slice(1))}</span>
        </Stack>

        <Button
          role="button"
          name="logout"
          className="logout-button"
          variant="text"
          onClick={logout}
        >
          LOGOUT
        </Button>
      </Stack>
    );
  } else {
    headerAction = (
      <Stack direction="row" spacing={2}>
        <Button
          role="button"
          name="login"
          className="login-button"
          variant="outlined"
          onClick={goToLoginPage}
        >
          LOGIN
        </Button>
        <Button
          role="button"
          name="register"
          className="register-button"
          variant="contained"
          onClick={goToRegistrationPage}
        >
          REGISTER
        </Button>
      </Stack>
    );
  }

  return (
    <Box className="header">
      <Box className="header-title">
        <Link to='/'>
          <img className="logo" src='logo_dark.svg' alt="QKart-icon"></img>
        </Link>
      </Box>
      {children}
      {headerAction}
    </Box>
  );
};

export default Header;
