import React from "react";
import HeartIcon from "../../assets/icons/HeartIcon"; // Assuming you have HeartIcon available
import CartIcon from "../../assets/icons/CartIcon";

// Reusable component for a product card
const ProductCard = ({ product }) => (
  <div className="product-card shop-card">
    <div className="product-image-container">
      <img src={product.image} alt={product.name} />
      {/* Favorite Button on the corner */}
      <button className="favorite-btn" aria-label="Add to Favorites">
        <HeartIcon />
      </button>
    </div>
    <div className="product-info">
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">{product.price}</p>
      <button className="add-to-cart-btn">
        <CartIcon style={{ width: "16px", height: "16px" }} /> Add to Cart
      </button>
    </div>
  </div>
);

export default ProductCard;
