import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import Cart, { generateCartItemsFrom } from "./Cart";
import { Token } from "@mui/icons-material";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [debounceTimerId, setDebounceTimerId] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const { enqueueSnackbar } = useSnackbar();

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const showSnackbar = (message, variant) => {
    enqueueSnackbar(message, { variant });
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    const URL = `${config.endpoint}/products`;
    setIsLoading(true);
    try {
      const response = await axios.get(URL);
      setProducts(response.data);
      
      return response.data;
    } catch (error) {
      setIsLoading(false)
      showSnackbar(error.message, "error");
    } finally {
      // Hide the loader
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const handleError =async () => {
      const productsData = await performAPICall();
      if (!productsData?.length || !username) return;
      const cartData = await fetchCart(token);

      const completeProductsData = generateCartItemsFrom(
        cartData,
        productsData
      );

      setCartItems(completeProductsData);
    };

    handleError()
    
  }, []);

  // const updateSearchText = (e) => {
  //   debounceSearch(e, debounceTimerId);
  // };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    const URL = `${config.endpoint}/products/search?value=${text}`;
    setIsLoading(true)
    try {
      const response = await axios.get(URL);
      setProducts(response.data);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      if (error.response?.status === 404) {
        setProducts([]);
        return;
      }

      showSnackbar(error.message, "error");
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const setTimeoutId = setTimeout(() => {
      performSearch(event.target.value);
    }, 500);

    setDebounceTimerId(setTimeoutId);
    
    
  };

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const URL = `${config.endpoint}/cart`;
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(URL, { headers: headers });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    const isPresent = items.find((item) => item._id === productId);
    if (isPresent) return true;
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token) {
      showSnackbar("Login to add an item to the cart", "error");
      return;
    }

    const isItemPresent = isItemInCart(items, productId);
    if (options.preventDuplicate && isItemPresent) {
      showSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item",
        "warning"
      );
      return;
    }

    let cartData;
    try {
      const cartResponse = await postCartItem(token, productId, qty);
      cartData = cartResponse.data;
    }
    catch(error) {
      showSnackbar(error.message, 'error');
      return;
    }
    
    let completeCartData = generateCartItemsFrom(cartData, products);
    
    if(qty === 0) {
      completeCartData = completeCartData.filter(cartItem => cartItem.productId !== productId);
    }

    setCartItems(completeCartData);
  };

  const postCartItem = async (token, productId, qty) => {
      const headers = { Authorization: `Bearer ${token}` };
      const URL = `${config.endpoint}/cart`;
      const data = {productId, qty};
      try {
        const response = await axios.post(URL, data, {
          headers: headers
        })
        return response;
      }
      catch(error) {
        throw error;
      }
  }

  const handleAdd = async (token, items, products, productId, qty) => {
    const incrementedQty = qty + 1;
    await addToCart(token, items, products, productId, incrementedQty);
  };

  const handleDelete = async (token, items, products, productId, qty) => {
    const decrementedQty = qty - 1;
    await addToCart(token, items, products, productId, decrementedQty);
  };

  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          className="search search-desktop"
          size="small"
          placeholder="Search for items/categories"
          name="search"
          onChange={(e)=>{debounceSearch(e,debounceTimerId)}}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
        />
      </Header>

      

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        onChange={(e)=>{debounceSearch(e,debounceTimerId)}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>
        <Grid item className="products-container" md={username ? 9 : 12}>
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
          <Grid
            container
            direction="row"
            spacing={2}
            className="products-grid"
            justifyContent="center"
          >
            {isLoading ? (
              <Box className="loading">
                <CircularProgress className="loading" />
                <Typography variant="h6">Loading Products...</Typography>
              </Box>
            ) : products?.length >0 ? (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={username ? 4 : 3} key={product._id}>
                  <ProductCard
                    product={product}
                    products={products}
                    items={cartItems}
                    handleAddToCart={addToCart}
                  />
                </Grid>
              ))
            ) : (
              <Stack
                spacing={1}
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: 300 }}
              >
                <SentimentDissatisfiedIcon />
                <Typography variant="h5">No Products found</Typography>
              </Stack>
            )}
          </Grid>
        </Grid>

        {username ? (
          <Grid item md={3} xs={12} sx={{ backgroundColor: "#E9F5E1" }}>
            <Cart
              products={products}
              token={token}
              items={cartItems}
              handleAdd={handleAdd}
              handleDelete={handleDelete}
            />
          </Grid>
        ) : null}
      </Grid>
      <Footer />
          
    </div>
  );
};

export default Products;
