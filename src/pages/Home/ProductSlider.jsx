import React, { useRef, useEffect } from "react";
import ProductCard from "../../components/common/ProductCard";

// Mock data updated with unique, simple IDs for navigation
const trendingProducts = [
  {
    id: "battery",
    name: "Zynvert 12V 100Ah LiFePO4 Battery",
    price: "₹15,999",
    image: "https://placehold.co/400x400/eeeeee/333333?text=Zynvert+100Ah",
  },
  {
    id: "inverter",
    name: "Solar Integrated Inverter 3kW",
    price: "₹45,500",
    image: "https://placehold.co/400x400/eeeeee/333333?text=Solar+Inverter",
  },
  {
    id: "bms",
    name: "4S 100A BMS with Active Balancer",
    price: "₹2,499",
    image: "https://placehold.co/400x400/eeeeee/333333?text=4S+BMS",
  },
  {
    id: "wires",
    name: "High-Current DC Wires (10 Mtr)",
    price: "₹899",
    image: "https://placehold.co/400x400/eeeeee/333333?text=DC+Wires",
  },
  {
    id: "liion",
    name: "12V 50Ah Li-ion Pack (Lightweight)",
    price: "₹9,500",
    image: "https://placehold.co/400x400/FF6B6B/ffffff?text=50Ah+Li-ion",
  },
  {
    id: "controller",
    name: "20A PWM Solar Charge Controller",
    price: "₹1,250",
    image: "https://placehold.co/400x400/4ECDC4/ffffff?text=PWM+Controller",
  },
  {
    id: "holder",
    name: "Battery Cell Holder (Pack of 50)",
    price: "₹350",
    image: "https://placehold.co/400x400/3A3A3A/ffffff?text=Holders",
  },
  {
    id: "inverter2",
    name: "Pure Sine Wave Inverter 1kW",
    price: "₹12,000",
    image: "https://placehold.co/400x400/FF6B6B/ffffff?text=1kW+Inverter",
  },
  // Duplicate the list for seamless looping illusion
  {
    id: "battery-dup",
    name: "Zynvert 12V 100Ah LiFePO4 Battery",
    price: "₹15,999",
    image: "https://placehold.co/400x400/eeeeee/333333?text=Zynvert+100Ah",
  },
  {
    id: "inverter-dup",
    name: "Solar Integrated Inverter 3kW",
    price: "₹45,500",
    image: "https://placehold.co/400x400/eeeeee/333333?text=Solar+Inverter",
  },
  {
    id: "bms-dup",
    name: "4S 100A BMS with Active Balancer",
    price: "₹2,499",
    image: "https://placehold.co/400x400/eeeeee/333333?text=4S+BMS",
  },
  {
    id: "wires-dup",
    name: "High-Current DC Wires (10 Mtr)",
    price: "₹899",
    image: "https://placehold.co/400x400/eeeeee/333333?text=DC+Wires",
  },
  {
    id: "liion-dup",
    name: "12V 50Ah Li-ion Pack (Lightweight)",
    price: "₹9,500",
    image: "https://placehold.co/400x400/FF6B6B/ffffff?text=50Ah+Li-ion",
  },
  {
    id: "controller-dup",
    name: "20A PWM Solar Charge Controller",
    price: "₹1,250",
    image: "https://placehold.co/400x400/4ECDC4/ffffff?text=PWM+Controller",
  },
  {
    id: "holder-dup",
    name: "Battery Cell Holder (Pack of 50)",
    price: "₹350",
    image: "https://placehold.co/400x400/3A3A3A/ffffff?text=Holders",
  },
  {
    id: "inverter2-dup",
    name: "Pure Sine Wave Inverter 1kW",
    price: "₹12,000",
    image: "https://placehold.co/400x400/FF6B6B/ffffff?text=1kW+Inverter",
  },
];

// // Simple SVG placeholders for navigation arrows
// const LeftArrow = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polyline points="15 18 9 12 15 6"></polyline>
//   </svg>
// );
// const RightArrow = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width="24"
//     height="24"
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//   >
//     <polyline points="9 18 15 12 9 6"></polyline>
//   </svg>
// );

const ProductSlider = ({ title = "Trending Now", onNavigate, onAddToCart }) => {
  const scrollRef = useRef(null);

  const handleManualScroll = () => {
    console.log("Manual scroll disabled in continuous mode.");
  };

  useEffect(() => {
    // ... (existing continuous scrolling effect omitted for brevity) ...
  }, []);

  return (
    <section className="page-section section-reveal product-slider-section">
      <h2 className="section-title">{title}</h2>

      <div className="slider-container">
        {/* ... (omitted navigation buttons) ... */}

        {/* Scrollable Track - will be animated via CSS */}
        <div className="slider-track" ref={scrollRef}>
          {trendingProducts.map((product, index) => (
            <div key={product.id + index} className="slider-item">
              <ProductCard
                product={product}
                productId={product.id.replace("-dup", "")} // Use base ID for navigation
                onNavigate={onNavigate}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>

        {/* ... (omitted right navigation button) ... */}
      </div>
    </section>
  );
};
export default ProductSlider;
