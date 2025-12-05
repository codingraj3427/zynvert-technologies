import React, { useRef } from "react";
import ProductCard from "../../components/common/ProductCard";

// Mock data for the slider is doubled to create the infinite loop illusion
const trendingProducts = [
  {
    name: "Zynvert 12V 100Ah LiFePO4 Battery",
    price: "₹15,999",
    image: "https://placehold.co/400x400/eeeeee/333333?text=Zynvert+100Ah",
  },
  {
    name: "Solar Integrated Inverter 3kW",
    price: "₹45,500",
    image: "https://placehold.co/400x400/eeeeee/333333?text=Solar+Inverter",
  },
  {
    name: "4S 100A BMS with Active Balancer",
    price: "₹2,499",
    image: "https://placehold.co/400x400/eeeeee/333333?text=4S+BMS",
  },
  {
    name: "High-Current DC Wires (10 Mtr)",
    price: "₹899",
    image: "https://placehold.co/400x400/eeeeee/333333?text=DC+Wires",
  },
  {
    name: "12V 50Ah Li-ion Pack (Lightweight)",
    price: "₹9,500",
    image: "https://placehold.co/400x400/FF6B6B/ffffff?text=50Ah+Li-ion",
  },
  {
    name: "20A PWM Solar Charge Controller",
    price: "₹1,250",
    image: "https://placehold.co/400x400/4ECDC4/ffffff?text=PWM+Controller",
  },
  {
    name: "Battery Cell Holder (Pack of 50)",
    price: "₹350",
    image: "https://placehold.co/400x400/3A3A3A/ffffff?text=Holders",
  },
  {
    name: "Pure Sine Wave Inverter 1kW",
    price: "₹12,000",
    image: "https://placehold.co/400x400/FF6B6B/ffffff?text=1kW+Inverter",
  },
  // Duplicate the list for seamless looping illusion
  {
    name: "Zynvert 12V 100Ah LiFePO4 Battery",
    price: "₹15,999",
    image: "https://placehold.co/400x400/eeeeee/333333?text=Zynvert+100Ah",
  },
  {
    name: "Solar Integrated Inverter 3kW",
    price: "₹45,500",
    image: "https://placehold.co/400x400/eeeeee/333333?text=Solar+Inverter",
  },
  {
    name: "4S 100A BMS with Active Balancer",
    price: "₹2,499",
    image: "https://placehold.co/400x400/eeeeee/333333?text=4S+BMS",
  },
  {
    name: "High-Current DC Wires (10 Mtr)",
    price: "₹899",
    image: "https://placehold.co/400x400/eeeeee/333333?text=DC+Wires",
  },
  {
    name: "12V 50Ah Li-ion Pack (Lightweight)",
    price: "₹9,500",
    image: "https://placehold.co/400x400/FF6B6B/ffffff?text=50Ah+Li-ion",
  },
  {
    name: "20A PWM Solar Charge Controller",
    price: "₹1,250",
    image: "https://placehold.co/400x400/4ECDC4/ffffff?text=PWM+Controller",
  },
  {
    name: "Battery Cell Holder (Pack of 50)",
    price: "₹350",
    image: "https://placehold.co/400x400/3A3A3A/ffffff?text=Holders",
  },
  {
    name: "Pure Sine Wave Inverter 1kW",
    price: "₹12,000",
    image: "https://placehold.co/400x400/FF6B6B/ffffff?text=1kW+Inverter",
  },
];

// Simple SVG placeholders for navigation arrows
const LeftArrow = () => (
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
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
const RightArrow = () => (
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
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ProductSlider = ({ title = "Trending Now" }) => {
  // scrollRef is now only used for dimension calculation in CSS
  const scrollRef = useRef(null);

  // Since we are using CSS animation for continuous scroll,
  // manual button actions are typically removed or disabled.
  // We'll keep the buttons but make them non-functional/decorative for this mode.
  const handleManualScroll = () => {
    console.log("Manual scroll disabled in continuous mode.");
  };

  return (
    <section className="page-section section-reveal product-slider-section">
      <h2 className="section-title">{title}</h2>

      <div className="slider-container">
        {/* Navigation buttons are disabled or removed in a pure CSS continuous slider */}
        {/* Keeping them in case the user wants to re-enable JS logic later */}
        <button
          className="slider-nav-btn left-btn"
          onClick={handleManualScroll}
          aria-label="Previous Products"
          disabled
        >
          <LeftArrow />
        </button>

        {/* Scrollable Track - will be animated via CSS */}
        <div className="slider-track" ref={scrollRef}>
          {trendingProducts.map((product, index) => (
            <div key={index} className="slider-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          className="slider-nav-btn right-btn"
          onClick={handleManualScroll}
          aria-label="Next Products"
          disabled
        >
          <RightArrow />
        </button>
      </div>
    </section>
  );
};

export default ProductSlider;
