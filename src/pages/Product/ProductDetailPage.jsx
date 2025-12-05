import React, { useState } from "react";
import HeartIcon from "../../assets/icons/HeartIcon";
import CartIcon from "../../assets/icons/CartIcon";
import ProductCard from "../../components/common/ProductCard";

// --- RICH MOCK PRODUCT DATA (Demo for 3 Products) ---
const mockProductDetails = {
  battery: {
    id: "battery",
    name: "Zynvert 12V 100Ah LiFePO4 Battery",
    tagline: "High-Capacity, Deep-Cycle Power for Solar & Backup Systems.",
    price: "₹15,999",
    numericPrice: 15999,
    rating: 4.8,
    reviews: 145,
    inStock: true,
    image:
      "https://placehold.co/800x800/eeeeee/333333?text=LiFePO4+Battery+Primary",
    gallery: [
      { url: "https://placehold.co/150x150/eeeeee/333333?text=Angle+1" },
      { url: "https://placehold.co/150x150/4ECDC4/ffffff?text=Terminals" },
      { url: "https://placehold.co/150x150/3A3A3A/ffffff?text=BMS+Inside" },
      { url: "https://placehold.co/150x150/FF6B6B/ffffff?text=3D+View" },
    ],
    summary: [
      "5000+ Deep Cycles for 15+ years of reliable service.",
      "Integrated Smart BMS for complete protection against overcharge/discharge.",
      "Lightweight and compact; 50% lighter than lead-acid equivalent.",
      "Perfect for RVs, marine applications, and home energy storage.",
    ],
    technicalSpecs: {
      "Electrical Specifications": [
        { key: "Nominal Voltage", value: "12.8V" },
        { key: "Nominal Capacity", value: "100Ah" },
        { key: "Max Charge Current", value: "100A" },
        { key: "Max Discharge Current", value: "100A" },
        { key: "Cycle Life", value: ">5000 cycles @ 80% DOD" },
      ],
      "Physical & Safety": [
        { key: "Dimensions (LxWxH)", value: "330 x 173 x 215 mm" },
        { key: "Weight", value: "12.5 kg" },
        { key: "Case Material", value: "ABS Plastic" },
        { key: "Certifications", value: "BIS, CE, UN38.3" },
      ],
    },
    documentation: [
      { name: "User Manual (PDF)", link: "/docs/battery-manual.pdf" },
      { name: "Safety Datasheet (SDS)", link: "/docs/battery-sds.pdf" },
    ],
  },
  bms: {
    id: "bms",
    name: "4S 100A BMS with Active Balancer",
    tagline: "Advanced Protection and Balancing for LiFePO4 Battery Packs.",
    price: "₹2,499",
    numericPrice: 2499,
    rating: 4.5,
    reviews: 88,
    inStock: true,
    image:
      "https://placehold.co/800x800/eeeeee/333333?text=BMS+Active+Balancer",
    gallery: [
      { url: "https://placehold.co/150x150/eeeeee/333333?text=Top+View" },
      { url: "https://placehold.co/150x150/4ECDC4/ffffff?text=Wiring+Diagram" },
    ],
    summary: [
      "Active balancing up to 5A for superior cell health and lifespan.",
      "Over-charge, over-discharge, over-current, and short-circuit protection.",
      "Suitable for 12V LiFePO4 configurations (4 series cells).",
      "Thermal management system with temperature sensors.",
    ],
    technicalSpecs: {
      "Protection Parameters": [
        { key: "Max Charge Current", value: "100A" },
        { key: "Max Discharge Current", value: "100A" },
        { key: "Overcharge Detection", value: "3.75V ± 0.05V per cell" },
        { key: "Over-discharge Detection", value: "2.1V ± 0.08V per cell" },
        { key: "Short Circuit Protection", value: "Yes" },
      ],
      Balancing: [
        { key: "Balancing Type", value: "Active Balancing" },
        { key: "Balancing Current", value: "5A (Max)" },
        { key: "Balancing Start Voltage", value: "3.0V" },
      ],
    },
    documentation: [
      { name: "BMS Wiring Guide (PDF)", link: "/docs/bms-wiring.pdf" },
      { name: "BMS Data Sheet", link: "/docs/bms-datasheet.pdf" },
    ],
  },
  inverter: {
    id: "inverter",
    name: "Solar Integrated Inverter 3kW",
    tagline: "Hybrid Inverter/Charger with MPPT for off-grid power.",
    price: "₹45,500",
    numericPrice: 45500,
    rating: 4.9,
    reviews: 55,
    inStock: true,
    image: "https://placehold.co/800x800/eeeeee/333333?text=3kW+Inverter",
    gallery: [
      { url: "https://placehold.co/150x150/eeeeee/333333?text=Front+Panel" },
      {
        url: "https://placehold.co/150x150/4ECDC4/ffffff?text=Internal+Cooling",
      },
      {
        url: "https://placehold.co/150x150/3A3A3A/ffffff?text=Connection+Ports",
      },
    ],
    summary: [
      "Pure Sine Wave output for sensitive electronics.",
      "Integrated MPPT Charge Controller for 30% higher solar yield.",
      "Supports Lithium (LiFePO4/Li-ion) and Lead-Acid batteries.",
      "Seamless switching for uninterruptible power supply (UPS) capability.",
    ],
    technicalSpecs: {
      "AC & Output": [
        { key: "Rated Power", value: "3000W" },
        { key: "Output Voltage", value: "230V AC ± 5%" },
        { key: "Waveform", value: "Pure Sine Wave" },
        { key: "Transfer Time", value: "<10ms" },
      ],
      "Solar Input (MPPT)": [
        { key: "Max PV Array Power", value: "4000W" },
        { key: "MPPT Range", value: "120V DC - 450V DC" },
        { key: "Max PV Array Open Circuit Voltage", value: "500V DC" },
      ],
      "Battery & Charging": [
        { key: "Battery Voltage", value: "48V DC" },
        { key: "Max AC Charge Current", value: "60A" },
      ],
    },
    documentation: [
      { name: "Inverter Setup Guide (PDF)", link: "/docs/inverter-manual.pdf" },
      {
        name: "Troubleshooting Guide",
        link: "/docs/inverter-troubleshoot.pdf",
      },
    ],
  },
  wires: {
    id: "wires",
    name: "High-Current DC Wires (10 Mtr)",
    tagline: "Ultra-Low Resistance Tinned Copper Wires (4 AWG).",
    price: "₹899",
    numericPrice: 899,
    rating: 4.2,
    reviews: 32,
    inStock: true,
    image: "https://placehold.co/800x800/eeeeee/333333?text=DC+Wires+4AWG",
    gallery: [
      { url: "https://placehold.co/150x150/eeeeee/333333?text=Wires+1" },
    ],
    summary: [
      "10 meters in length (5 red, 5 black).",
      "High-flex silicone jacket.",
      "Essential for high-current battery connections.",
    ],
    technicalSpecs: {
      "Wire Specifications": [
        { key: "Length", value: "10m Total" },
        { key: "Gauge", value: "4 AWG" },
        { key: "Conductor", value: "Tinned Copper" },
      ],
    },
    documentation: [
      { name: "Wiring Safety Guide (PDF)", link: "/docs/wire-safety.pdf" },
    ],
  },
  liion: {
    id: "liion",
    name: "12V 50Ah Li-ion Pack (Lightweight)",
    tagline: "High Energy Density for Portable Power Applications.",
    price: "₹9,500",
    numericPrice: 9500,
    rating: 4.6,
    reviews: 68,
    inStock: true,
    image: "https://placehold.co/800x800/FF6B6B/ffffff?text=Li-ion+Pack",
    gallery: [{ url: "https://placehold.co/150x150/FF6B6B/ffffff?text=Front" }],
    summary: [
      "Extremely light and portable.",
      "Built-in protection circuit.",
      "Ideal for low-power mobile devices and camping.",
    ],
    technicalSpecs: {
      Electrical: [
        { key: "Nominal Voltage", value: "11.1V" },
        { key: "Capacity", value: "50Ah" },
        { key: "Weight", value: "5.5 kg" },
      ],
      Safety: [
        { key: "Max Discharge", value: "40A" },
        { key: "Cell Type", value: "18650" },
      ],
    },
    documentation: [
      { name: "User Guide", link: "/docs/liion-guide.pdf" },
      { name: "Safety Datasheet (SDS)", link: "/docs/liion-sds.pdf" },
    ],
  },
  controller: {
    id: "controller",
    name: "20A PWM Solar Charge Controller",
    tagline: "Affordable and Reliable Charging for Small Solar Setups.",
    price: "₹1,250",
    numericPrice: 1250,
    rating: 4.0,
    reviews: 95,
    inStock: true,
    image: "https://placehold.co/800x800/4ECDC4/ffffff?text=PWM+Controller",
    gallery: [
      { url: "https://placehold.co/150x150/4ECDC4/ffffff?text=Display" },
    ],
    summary: [
      "Automatic 12V/24V system voltage detection.",
      "Overload and short-circuit protection.",
      "Digital display for easy monitoring.",
    ],
    technicalSpecs: {
      Charging: [
        { key: "Type", value: "PWM" },
        { key: "Rated Current", value: "20A" },
        { key: "Max PV Input Voltage", value: "55V" },
      ],
    },
    documentation: [
      { name: "Controller Manual", link: "/docs/pwm-manual.pdf" },
      { key: "Setup Diagram", value: "/docs/pwm-diagram.pdf" },
    ],
  },
  holder: {
    id: "holder",
    name: "Battery Cell Holder (Pack of 50)",
    tagline: "Durable 18650 Cell Holders for Custom Battery Packs.",
    price: "₹350",
    numericPrice: 350,
    rating: 4.7,
    reviews: 212,
    inStock: true,
    image: "https://placehold.co/800x800/3A3A3A/ffffff?text=18650+Holders",
    gallery: [
      { url: "https://placehold.co/150x150/3A3A3A/ffffff?text=Single+Cell" },
    ],
    summary: [
      "Interlocking modular design.",
      "High-temperature resistant material.",
      "Ensures proper cell spacing and airflow.",
    ],
    technicalSpecs: {
      "Material & Design": [
        { key: "Cell Type", value: "18650" },
        { key: "Quantity", value: "50 pieces" },
        { key: "Material", value: "ABS/PC" },
      ],
    },
    documentation: [
      { name: "Assembly Guide", link: "/docs/holder-assembly.pdf" },
    ],
  },
  inverter2: {
    id: "inverter2",
    name: "Pure Sine Wave Inverter 1kW",
    tagline: "12V DC to 230V AC Pure Sine Wave Output.",
    price: "₹12,000",
    numericPrice: 12000,
    rating: 4.3,
    reviews: 40,
    inStock: true,
    image: "https://placehold.co/800x800/FF6B6B/ffffff?text=1kW+Inverter",
    gallery: [
      { url: "https://placehold.co/150x150/FF6B6B/ffffff?text=Back+Ports" },
    ],
    summary: [
      "Guarantees safe operation for sensitive electronics.",
      "Compact footprint and silent operation.",
      "High efficiency design.",
    ],
    technicalSpecs: {
      Performance: [
        { key: "Rated Power", value: "1000W" },
        { key: "Peak Power", value: "2000W" },
        { key: "DC Input", value: "12V" },
      ],
      Output: [{ key: "Waveform", value: "Pure Sine Wave" }],
    },
    documentation: [
      { name: "Quick Start Guide", link: "/docs/1kw-quickstart.pdf" },
      { name: "Spec Sheet", link: "/docs/1kw-specs.pdf" },
    ],
  },
  "jbd-bms": {
    id: "jbd-bms",
    name: "JBD Active Balancer BMS 8S",
    tagline: "Bluetooth Monitoring and 1A Active Balancing for 8-Cell Packs.",
    price: "₹5,200",
    numericPrice: 5200,
    rating: 4.7,
    reviews: 62,
    inStock: true,
    image: "https://placehold.co/800x800/4ECDC4/ffffff?text=JBD+8S+BMS",
    gallery: [
      { url: "https://placehold.co/150x150/4ECDC4/ffffff?text=JBD+Top" },
    ],
    summary: [
      "Connect via Bluetooth to monitor cells in real-time.",
      "Active 1A balancing current.",
      "Reliable over-temperature protection.",
    ],
    technicalSpecs: {
      BMS: [
        { key: "Cell Count", value: "8S" },
        { key: "Max Current", value: "60A" },
        { key: "Balancing Type", value: "Active (1A)" },
      ],
      Monitoring: [{ key: "Communication", value: "Bluetooth (App)" }],
    },
    documentation: [
      { name: "App Guide", link: "/docs/jbd-app-guide.pdf" },
      { name: "Wiring Diagram (8S)", link: "/docs/jbd-8s-wiring.pdf" },
    ],
  },
  "power-system": {
    id: "power-system",
    name: "3kW Integrated Power System",
    tagline: "All-in-One Hybrid Solution for Residential Energy.",
    price: "₹95,000",
    numericPrice: 95000,
    rating: 4.8,
    reviews: 21,
    inStock: false,
    image: "https://placehold.co/800x800/3A3A3A/ffffff?text=Integrated+Power",
    gallery: [
      { url: "https://placehold.co/150x150/3A3A3A/ffffff?text=System+View" },
    ],
    summary: [
      "Seamlessly combines solar, battery, and utility power.",
      "High-efficiency 3kW output.",
      "User-friendly touchscreen interface.",
    ],
    technicalSpecs: {
      System: [
        { key: "Rated Power", value: "3000W" },
        { key: "Battery Voltage", value: "48V" },
        { key: "Transfer Time", value: "<10ms" },
      ],
      Features: [{ key: "Integration", value: "Grid/Solar/Battery" }],
    },
    documentation: [
      { name: "Full Manual", link: "/docs/system-full-manual.pdf" },
      { name: "Installation Diagram", link: "/docs/system-install.pdf" },
    ],
  },
};

// --- Single Product Page Component ---
const ProductDetailPage = ({ productId, onNavigate, onAddToCart }) => {
  const [activeTab, setActiveTab] = useState("specs");

  // Use a default product if ID is not found (or always assume a product exists for demo)
  const product =
    mockProductDetails[productId] || mockProductDetails["battery"];

  // FIX: Moved mock data definition inside the functional component body
  const relatedProducts = [
    mockProductDetails["bms"],
    mockProductDetails["liion"],
    mockProductDetails["wires"],
  ];

  const renderTabContent = () => {
    // ... (rest of renderTabContent function implementation is unchanged)
    switch (activeTab) {
      case "overview":
        return (
          <div className="tab-content-section">
            <h3>Product Overview: The Core Benefits</h3>
            <ul className="overview-list">
              {product.summary.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p style={{ marginTop: "20px", fontWeight: "500" }}>
              Designed for reliability and safety, this product integrates
              cutting-edge technology to provide superior energy performance.
              Perfect for continuous off-grid use or as a robust emergency
              backup.
            </p>
          </div>
        );
      case "specs":
        return (
          <div className="tab-content-section specs-table">
            <h3>Detailed Technical Specifications</h3>
            {Object.entries(product.technicalSpecs).map(([group, specs]) => (
              <div key={group} className="specs-group">
                <h4>{group}</h4>
                <table className="specs-table-content">
                  <tbody>
                    {specs.map((spec, index) => (
                      <tr key={index}>
                        <th>{spec.key}</th>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        );
      case "docs":
        return (
          <div className="tab-content-section documentation-links">
            <h3>Downloads & Documentation</h3>
            <p>Access manuals, wiring diagrams, and safety certifications. </p>
            <ul className="doc-list">
              {product.documentation.map((doc, index) => (
                <li key={index}>
                  <a href={doc.link} target="_blank" rel="noopener noreferrer">
                    {doc.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      case "reviews":
        return (
          <div className="tab-content-section">
            <h3>Customer Reviews (Verified Buyers)</h3>
            <p>
              {product.reviews} Verified Reviews — Average Rating{" "}
              {product.rating}
            </p>
            <div
              className="review-mock"
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginTop: "15px",
                borderRadius: "8px",
              }}
            >
              <p>
                ⭐ ⭐ ⭐ ⭐ ⭐ **Amazing Performance** - Purchased this for my
                solar setup. The BMS is top-notch and the capacity is exactly as
                advertised. Highly recommend Zynvert! - *Verified Buyer,
                Chennai*
              </p>
            </div>
            <div
              className="review-mock"
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                marginTop: "10px",
                borderRadius: "8px",
              }}
            >
              <p>
                ⭐ ⭐ ⭐ ⭐ **Excellent Value** - Great battery, shipping was
                fast. Only issue was a small delay in tracking update.
                Performance is solid. - *Verified Buyer, Kolkata*
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="product-detail-page section-reveal visible">
      {/* 1. Top Section: Trust & Clarity */}
      <div className="product-header-grid">
        {/* A. Image Gallery */}
        <div className="image-gallery-container">
          <img
            src={product.image}
            alt={product.name}
            className="main-product-image"
          />
          <div className="thumbnail-strip">
            {product.gallery.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt={`Thumbnail ${index + 1}`}
                className="thumbnail-image"
              />
            ))}
          </div>
        </div>

        {/* B. Details & Buying Controls */}
        <div className="product-details-container">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-tagline">{product.tagline}</p>

          {/* Ratings */}
          <div className="product-rating">
            <span className="stars">
              {"⭐".repeat(Math.round(product.rating))} ({product.rating})
            </span>
            <span className="review-count"> - {product.reviews} Reviews</span>
          </div>

          <hr className="divider" />

          {/* Price & Status */}
          <p className="price-display">{product.price}</p>
          <p
            className={`stock-status ${
              product.inStock ? "in-stock" : "out-of-stock"
            }`}
          >
            {product.inStock ? "In Stock - Ready to Ship" : "Out of Stock"}
          </p>

          <div className="buying-controls">
            <div className="quantity-selector">
              <button>-</button>
              <input type="text" value="1" readOnly />
              <button>+</button>
            </div>
            <button
              className="add-to-cart-btn"
              onClick={() => onAddToCart(product)}
            >
              <CartIcon /> Add to Cart
            </button>
            <button className="buy-now-btn">Buy Now</button>
          </div>

          {/* E. Quick Trust Seals */}
          <div className="trust-seals">
            <div className="trust-item">✅ **5000+** Cycle Life</div>
            <div className="trust-item">🔒 **Smart BMS** Protection</div>
            <div className="trust-item">🚚 **Fast** Delivery Available</div>
          </div>
        </div>
      </div>

      {/* 2. Mid-Section: Technical Deep Dive (Tabbed Interface) */}
      <div className="product-tabs-container">
        <div className="tabs-nav">
          {["overview", "specs", "docs", "reviews"].map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="tabs-content">{renderTabContent()}</div>
      </div>

      <hr className="divider" />

      {/* 3. Bottom Section: Related Products */}
      <div className="related-products-section page-section">
        <h2 className="section-title">Customers Also Viewed</h2>
        <div className="product-grid">
          {relatedProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              productId={product.id}
              onNavigate={onNavigate}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
