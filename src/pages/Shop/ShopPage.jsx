import React, { useState } from "react";
import ProductCard from "../../components/common/ProductCard";

// --- MOCK DATA AUGMENTED with filterable properties (including numericPrice) ---
const initialProducts = [
  {
    id: "battery",
    name: "Zynvert 12V 100Ah LiFePO4 Battery",
    price: "₹15,999",
    numericPrice: 15999,
    category: "Lithium & LiFePO4 Batteries",
    brand: "Zynvert",
    voltage: "12V",
  },
  {
    id: "inverter",
    name: "Solar Integrated Inverter 3kW",
    price: "₹45,500",
    numericPrice: 45500,
    category: "Inverters & Solar",
    brand: "Victron",
    voltage: "48V",
  },
  {
    id: "bms",
    name: "4S 100A BMS with Active Balancer",
    price: "₹2,499",
    numericPrice: 2499,
    category: "BMS & Protection Boards",
    brand: "Daly",
    voltage: "12V",
  },
  {
    id: "wires",
    name: "High-Current DC Wires (10 Mtr)",
    price: "₹899",
    numericPrice: 899,
    category: "Wires & Connectors",
    brand: "Zynvert",
    voltage: "N/A",
  },
  {
    id: "liion",
    name: "12V 50Ah Li-ion Pack (Lightweight)",
    price: "₹9,500",
    numericPrice: 9500,
    category: "Battery Packs",
    brand: "Zynvert",
    voltage: "12V",
  },
  {
    id: "controller",
    name: "20A PWM Solar Charge Controller",
    price: "₹1,250",
    numericPrice: 1250,
    category: "Chargers & Power Supplies",
    brand: "Other Brands",
    voltage: "24V",
  },
  {
    id: "holder",
    name: "Battery Cell Holder (Pack of 50)",
    price: "₹350",
    numericPrice: 350,
    category: "Raw Cells & Holders",
    brand: "Other Brands",
    voltage: "N/A",
  },
  {
    id: "inverter2",
    name: "Pure Sine Wave Inverter 1kW",
    price: "₹12,000",
    numericPrice: 12000,
    category: "Inverters & Solar",
    brand: "Other Brands",
    voltage: "24V",
  },
  {
    id: "jbd-bms",
    name: "JBD Active Balancer BMS 8S",
    price: "₹5,200",
    numericPrice: 5200,
    category: "BMS & Protection Boards",
    brand: "JBD",
    voltage: "24V",
  },
  {
    id: "power-system",
    name: "3kW Integrated Power System",
    price: "₹95,000",
    numericPrice: 95000,
    category: "Inverters & Solar",
    brand: "Zynvert",
    voltage: "48V",
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
  ],
  brand: ["Zynvert", "Daly", "JBD", "Victron", "Other Brands"],
  voltage: ["12V", "24V", "48V", "N/A"],
  price: [
    "Under ₹1,000",
    "₹1,000 - ₹5,000",
    "₹5,000 - ₹20,000",
    "Over ₹20,000",
  ],
};

// --- HELPER FUNCTION FOR PRICE FILTERING ---
const checkPriceMatch = (productPrice, selectedRanges) => {
  if (!selectedRanges || selectedRanges.length === 0) {
    return true;
  }

  const price = productPrice;

  return selectedRanges.some((range) => {
    if (range.includes("Under")) {
      const maxPrice = 1000;
      return price < maxPrice;
    } else if (range.includes("Over")) {
      const minPrice = 20000;
      return price > minPrice;
    } else {
      const parts = range.split(" - ");
      const minPrice = parseInt(parts[0].replace(/[^0-9]/g, ""), 10);
      const maxPrice = parseInt(parts[1].replace(/[^0-9]/g, ""), 10);
      return price >= minPrice && price <= maxPrice;
    }
  });
};

// --- SHOP PAGE COMPONENT with Filtering Logic ---
const ShopPage = ({ onNavigate, onAddToCart }) => {
  const [displayedProducts, setDisplayedProducts] = useState(initialProducts);
  const [selectedFilters, setSelectedFilters] = useState({});

  const toggleFilter = (group, value) => {
    setSelectedFilters((prevFilters) => {
      const currentValues = prevFilters[group] || [];
      const isSelected = currentValues.includes(value);

      let newValues;
      if (isSelected) {
        newValues = currentValues.filter((v) => v !== value);
      } else {
        newValues = [...currentValues, value];
      }

      if (newValues.length === 0) {
        const { [group]: _, ...rest } = prevFilters;
        return rest;
      }

      return { ...prevFilters, [group]: newValues };
    });
  };

  const applyFilters = () => {
    const activeFilterGroups = Object.keys(selectedFilters);

    if (activeFilterGroups.length === 0) {
      setDisplayedProducts(initialProducts);
      return;
    }

    const filtered = initialProducts.filter((product) => {
      // Product must pass ALL active filter groups (AND logic between groups).
      return activeFilterGroups.every((group) => {
        const filterValues = selectedFilters[group];

        if (group === "price") {
          return checkPriceMatch(product.numericPrice, filterValues);
        }

        const productValue = product[group];
        // Check if the product's property value is included in the selected filter values.
        return filterValues.includes(productValue);
      });
    });

    setDisplayedProducts(filtered);
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
                  <li key={group + option}>
                    <label>
                      <input
                        type="checkbox"
                        checked={
                          selectedFilters[group]?.includes(option) || false
                        }
                        onChange={() => toggleFilter(group, option)}
                      />
                      {option}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* This button now triggers the filtering logic */}
          <button className="apply-filter-btn" onClick={applyFilters}>
            Apply Filters
          </button>
        </aside>

        {/* Product Listing Area */}
        <div className="product-listing-area">
          <div className="sort-bar">
            <p className="product-count">
              {displayedProducts.length} Products Found
            </p>
            <select className="sort-dropdown">
              <option>Sort by: Best Match</option>
              <option>Sort by: Price: Low to High</option>
              <option>Sort by: Price: High to Low</option>
              <option>Sort by: Newest</option>
            </select>
          </div>

          <div className="product-grid shop-grid">
            {displayedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                productId={product.id}
                onNavigate={onNavigate}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {displayedProducts.length === 0 && (
            <p
              style={{
                textAlign: "center",
                marginTop: "50px",
                fontSize: "1.2rem",
                color: "#666",
              }}
            >
              No products match your current filters. Try a different
              combination!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
