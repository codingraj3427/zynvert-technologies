import React from "react";
import ProductCard from "../../components/common/ProductCard"; // NEW IMPORT

const featuredProductsWithIds = [
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
];

const FeaturedProducts = ({ onNavigate, onAddToCart }) => (
  <section className="page-section bg-light section-reveal">
    <h2 className="section-title">Our Featured Products</h2>
    <div className="product-grid">
      {featuredProductsWithIds.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          productId={product.id}
          onNavigate={onNavigate}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  </section>
);

export default FeaturedProducts;
