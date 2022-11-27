import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
  Stack,
} from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart, products, items }) => {
  const token = localStorage.getItem('token');
  return (
    <Card className="card" sx={{ maxWidth: '100%', maxHeight: '100%' }}>
      <CardMedia
        component="img"
        src={product.image}
        alt={product.name}
        sx={{height: 200}}
      />

      <CardContent>
        <Typography gutterBottom>{product.name}</Typography>
        <Typography gutterBottom variant="h5">
          ${product.cost}
        </Typography>

        <Rating name="read-only" value={product.rating} readOnly />
      </CardContent>

      <CardActions>
        <Button
          className="card-button"
          variant="outlined"
          fullWidth
          startIcon={<ShoppingCartIcon />}
          onClick={async () => await handleAddToCart(token, items, products, product._id, 1, {preventDuplicate: true})}
        >
            ADD TO CART
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
