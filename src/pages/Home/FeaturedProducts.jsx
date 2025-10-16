import React from "react";

const FeaturedProducts = ({ featuredProducts }) => (
  <section className="page-section bg-light section-reveal">
    <h2 className="section-title">Our Featured Products</h2>
    <div className="product-grid">
      {featuredProducts.map((product) => (
        <div key={product.name} className="product-card">
          <div className="product-image-container">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">{product.price}</p>
            <button className="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturedProducts;