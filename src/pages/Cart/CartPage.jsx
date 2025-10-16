import React, { useState } from "react";
const CartPage = ({ onNavigate }) => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Zynvert 12V 100Ah LiFePO4 Battery", price: 15999, quantity: 1, image: "https://placehold.co/150x150/eeeeee/333333?text=Zynvert+100Ah" },
    { id: 2, name: "4S 100A BMS with Active Balancer", price: 2499, quantity: 2, image: "https://placehold.co/150x150/eeeeee/333333?text=4S+BMS" },
  ]);
  const handleQuantityChange = (id, amount) => { setCartItems(cartItems.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item)); };
  const removeItem = (id) => { setCartItems(cartItems.filter((item) => item.id !== id)); };
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart section-reveal visible">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button onClick={() => onNavigate("home")} className="auth-btn">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page section-reveal visible">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <button onClick={() => onNavigate("home")} className="continue-shopping-btn">Continue Shopping</button>
      </div>
      <div className="cart-layout">
        <div className="cart-items-container">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <p className="cart-item-name">{item.name}</p>
                <div className="quantity-selector">
                  <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                  <input type="text" value={item.quantity} readOnly />
                  <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                </div>
              </div>
              <div className="cart-item-price-actions">
                <p className="cart-item-price">₹{(item.price * item.quantity).toLocaleString()}</p>
                <button onClick={() => removeItem(item.id)} className="remove-item-btn">Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary-container">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
          <div className="summary-row"><span>Shipping</span><span>₹{shipping.toLocaleString()}</span></div>
          <hr />
          <div className="summary-row total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;