import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";

import { Typography } from "@mui/material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
import "./Cart.css";

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

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 *
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  const completeProductsData = cartData.map((cartDataItem) => {
    const cartProduct = productsData.find(
      (productData) => productData._id === cartDataItem.productId
    );

    return {
      ...cartProduct,
      ...cartDataItem,
    };
  });
  return completeProductsData;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  const totalCartValue = items.reduce((totalValue, item) => {
    totalValue += item.qty * item.cost;
    return totalValue;
  }, 0);

  return totalCartValue;
};

// TODO: CRIO_TASK_MODULE_CHECKOUT - Implement function to return total cart quantity
/**
 * Return the sum of quantities of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products in cart
 *
 * @returns { Number }
 *    Total quantity of products added to the cart
 *
 */
export const getTotalItems = (items = []) => {
  return items.reduce((totalItems, item) => {
    return totalItems + item.qty;
  }, 0)
};

/**
 * Component to display the Cart view
 *
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 *
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 *
 */

/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 *
 * @param {Number} value
 *    Current quantity of product in cart
 *
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 *
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 *
 *
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  token,
  products,
  items,
  item,
  isReadOnly,
}) => {
  return (
    <>
      {isReadOnly ? <Typography>Qty: {item.qty}</Typography>
      :
      <Stack direction="row" alignItems="center">
        <IconButton
          size="small"
          id="decrement"
          color="primary"
          onClick={async () =>
            await handleDelete(token, items, products, item.productId, item.qty)
          }
        >
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton
          size="small"
          id="increment"
          color="primary"
          onClick={async () =>
            await handleAdd(token, items, products, item.productId, item.qty)
          }
        >
          <AddOutlined />
        </IconButton>
      </Stack>
      }
    </>
  );
};

const CartItem = ({
  item,
  items,
  products,
  token,
  handleAdd,
  handleDelete,
  isReadOnly,
}) => {
  return (
    <Box display="flex" padding="1rem" >
      <Box className="image-container">
        <img
          src={item.image}
          // Add product name as alt eext
          alt={item.name}
        />
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="6rem"
        paddingX="1rem"
        sx={{width: '100%'}}
      >
        <div>{item.name}</div>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <ItemQuantity
            value={item.qty}
            items={items}
            item={item}
            products={products}
            token={token}
            handleAdd={handleAdd}
            handleDelete={handleDelete}
            isReadOnly={isReadOnly}
            // Add required props by checking implementation
          />
          <Box padding="0.5rem" fontWeight="700">
            ${item.cost}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const Cart = ({
  products,
  items = [],
  token,
  handleQuantity,
  handleAdd,
  handleDelete,
  isReadOnly,
}) => {
  const history = useHistory();
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            items={items}
            products={products}
            handleAdd={handleAdd}
            handleDelete={handleDelete}
            token={token}
            isReadOnly={isReadOnly}
          />
        ))}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          {!isReadOnly &&
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            type="button"
            role="button"
            onClick={() => history.push("/checkout")}
          >
            Checkout
          </Button>
          }
        </Box>
      </Box>

      {!!isReadOnly && 
      <Box className='order-details'>
        <Typography variant='h6' mb={1.5}>
          Order Details
        </Typography>
        <Stack spacing={1}>
          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='p'>
              Products
            </Typography>
            <span>
              {getTotalItems(items)}
            </span>
          </Stack>

          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='p'>
              Subtotal
            </Typography>
            <span>
              ${getTotalCartValue(items)}
            </span>
          </Stack>

          <Stack direction='row' justifyContent='space-between'>
            <Typography variant='p'>
              Shipping Charges
            </Typography>
            <span>
              $0
            </span>
          </Stack>

          <Stack direction='row' alignItems='center' justifyContent='space-between' color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem">
            <Typography variant='h6'>
              Total
            </Typography>
            <span>
              ${getTotalCartValue(items)}
            </span>
          </Stack>
        </Stack>
      </Box>
      }
    </>
  );
};

export default Cart;
