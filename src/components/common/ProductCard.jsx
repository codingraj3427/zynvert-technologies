import React from "react";
import HeartIcon from "../../assets/icons/HeartIcon";
import CartIcon from "../../assets/icons/CartIcon";

/**
 * Reusable component for displaying a single product card.
 * Handles navigation to the product detail page and adding the item to the cart.
 */
const ProductCard = ({ product, onNavigate, productId, onAddToCart }) => (
  // The main card container
  <div className="product-card shop-card">
    <div
      className="product-link-area"
      // Clickable area for navigation to the detail page
      onClick={() => onNavigate("product", productId)}
      style={{ cursor: "pointer" }}
    >
      <div className="product-image-container">
        <img src={product.image} alt={product.name} />
        {/* Favorite Button: Stops propagation so it doesn't trigger navigation */}
        <button
          className="favorite-btn"
          aria-label="Add to Favorites"
          onClick={(e) => {
            e.stopPropagation();
            console.log("Added to Favorites");
          }}
        >
          <HeartIcon />
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price}</p>
      </div>
    </div>

    {/* Add to Cart Button: Calls the global handler */}
    <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>
      <CartIcon style={{ width: "16px", height: "16px" }} /> Add to Cart
    </button>
  </div>
);

export default ProductCard;
