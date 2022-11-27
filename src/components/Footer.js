import { Box } from "@mui/system";
import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <Box className="footer">
      <Link to='/'>
          <img className="logo" src="logo_dark.svg" alt="QKart-icon"></img>
      </Link>
      <p className="footer-text">
        QKart is your one stop solution to the buy the latest trending items
        with India's Fastest Delivery to your doorstep
      </p>
    </Box>
  );
};

export default Footer;
