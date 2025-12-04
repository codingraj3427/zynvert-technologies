import React, { useState } from "react";
import ProductCard from "../../components/common/ProductCard";

// --- MOCK DATA FOR SHOP PAGE ---
const initialProducts = [
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

const mockFilters = {
  category: [
    "Lithium & LiFePO4 Batteries",
    "Inverters & Solar",
    "BMS & Protection Boards",
    "Battery Packs",
    "Wires & Connectors",
    "Chargers & Power Supplies",
    "Raw Cells & Holders",
    "Tools & Accessories",
  ],
  brand: ["Zynvert", "Daly", "JBD", "Victron", "Other Brands"],
  voltage: ["12V", "24V", "48V"],
  price: [
    "Under ₹1,000",
    "₹1,000 - ₹5,000",
    "₹5,000 - ₹20,000",
    "Over ₹20,000",
  ],
};

// --- SHOP PAGE COMPONENT ---
const ShopPage = () => {
  const [products, setProducts] = useState(initialProducts);

  // Placeholder for filter logic
  const toggleFilter = (group, value) => {
    console.log(`Filter toggled: ${group}: ${value}`);
  };

  return (
    <div className="shop-page page-section section-reveal visible">
      <h1 className="shop-title">All Products</h1>
      <div className="shop-layout">
        {/* Filter Sidebar (Sticky on Desktop) */}
        <aside className="filter-sidebar">
          <h2>Filter</h2>

          {Object.entries(mockFilters).map(([group, options]) => (
            <div key={group} className="filter-group">
              <h4>{group.charAt(0).toUpperCase() + group.slice(1)}</h4>
              <ul className="filter-list">
                {options.map((option) => (
                  <li key={option}>
                    <label>
                      <input
                        type="checkbox"
                        onChange={() => toggleFilter(group, option)}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button className="apply-filter-btn">Apply Filters</button>
        </aside>

        {/* Product Listing Area */}
        <div className="product-listing-area">
          <div className="sort-bar">
            <p className="product-count">{products.length} Products Found</p>
            <select className="sort-dropdown">
              <option>Sort by: Best Match</option>
              <option>Sort by: Price: Low to High</option>
              <option>Sort by: Price: High to Low</option>
              <option>Sort by: Newest</option>
            </select>
          </div>

          <div className="product-grid shop-grid">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
