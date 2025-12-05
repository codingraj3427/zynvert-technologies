import React from "react";

/**
 * CartPage component.
 * It is now a stateless component, relying on props for cart data and handlers.
 * * @param {object} props
 * @param {function} props.onNavigate - Function to change the application page.
 * @param {Array} props.cartItems - The current list of items in the cart.
 * @param {function} props.handleQuantityChange - Handler to update an item's quantity.
 * @param {function} props.removeItem - Handler to remove an item from the cart.
 */
const CartPage = ({
  onNavigate,
  cartItems,
  handleQuantityChange,
  removeItem,
}) => {
  // Calculations derived from props.cartItems
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 50; // Flat mock shipping cost
  const total = subtotal + shipping;

  // Function to format the price string to INR
  const formatPrice = (price) => `₹${price.toLocaleString()}`;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart section-reveal visible">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button onClick={() => onNavigate("shop")} className="auth-btn">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page section-reveal visible">
      <div className="cart-header">
        <h1>Your Shopping Cart ({cartItems.length} items)</h1>
        <button
          onClick={() => onNavigate("shop")}
          className="continue-shopping-btn"
        >
          Continue Shopping
        </button>
      </div>
      <div className="cart-layout">
        <div className="cart-items-container">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <p className="cart-item-name">{item.name}</p>
                <div className="quantity-selector">
                  <button onClick={() => handleQuantityChange(item.id, -1)}>
                    -
                  </button>
                  <input type="text" value={item.quantity} readOnly />
                  <button onClick={() => handleQuantityChange(item.id, 1)}>
                    +
                  </button>
                </div>
              </div>
              <div className="cart-item-price-actions">
                <p className="cart-item-price">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="remove-item-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary-container">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{formatPrice(shipping)}</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
