// src/pages/Home/ShowcaseSection.jsx

import React from "react";

const ShowcaseSection = ({
  recentlyLaunchedProducts,
  showcaseCategories,
  toUrlFriendly,
  onNavigate,
  onAddToCart,
}) => (
  <section className="page-section section-reveal">
    <h2 className="section-title">Recently Launched</h2>
    <div className="showcase-section">
      <div className="showcase-left">
        <div className="showcase-banner">
          <h2>Online Electronics Store</h2>
          <p>Just a Click to Get Your Electronics</p> <button>Shop Now</button>
        </div>
        <ul className="showcase-category-list">
          {showcaseCategories.map((cat) => (
            <li key={cat}>
              <a href={`/category/${toUrlFriendly(cat)}`}>{cat}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="showcase-right">
        <div className="showcase-product-grid">
          {recentlyLaunchedProducts.map((product) => (
            <div key={product.name} className="showcase-product-card">
              {/* Added Link Wrapper for Navigation */}
              <div
                className="showcase-link-wrapper"
                onClick={() => onNavigate("product", product.id)}
                style={{ cursor: "pointer" }}
              >
                <img src={product.image} alt={product.name} />
                <div className="showcase-product-info">
                  <p className="showcase-product-name">{product.name}</p>
                  <div className="showcase-product-pricing">
                    <span className="current-price">{product.oldPrice}</span>
                    <span className="old-price">{product.price}</span>
                  </div>
                </div>
              </div>

              {/* Added functional Add to Cart button */}
              <button
                className="add-to-cart-btn showcase-atc-btn"
                onClick={() => onAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ShowcaseSection;
