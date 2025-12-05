import React from "react";

const CartIcon = ({ itemCount = 0, style }) => (
  <span style={{ position: "relative", display: "inline-block", ...style }}>
    {/* Existing SVG Icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {" "}
      <circle cx="9" cy="21" r="1"></circle>{" "}
      <circle cx="20" cy="21" r="1"></circle>{" "}
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>{" "}
    </svg>

    {/* Cart Item Badge Logic */}
    {itemCount > 0 && (
      <span
        className="cart-badge"
        style={{
          position: "absolute",
          top: "-5px",
          right: "-5px",
          backgroundColor: "var(--primary-color, #ff6b6b)", // Vibrant Coral
          color: "var(--white-color, white)",
          borderRadius: "50%",
          padding: "2px 6px",
          fontSize: "10px",
          fontWeight: "700",
          lineHeight: "1",
          minWidth: "18px",
          textAlign: "center",
          border: "2px solid var(--white-color, white)",
        }}
      >
        {itemCount}
      </span>
    )}
  </span>
);

export default CartIcon;
