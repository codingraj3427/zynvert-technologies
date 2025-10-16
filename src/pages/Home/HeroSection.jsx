import React from "react";

const HeroSection = () => (
  <section className="hero-section section-reveal">
    <div className="hero-card large">
      <h2>Integrated Solar Inverters</h2>
      <p>Our flagship product for reliable, off-grid power.</p>
      <button>Shop Now</button>
    </div>
    <div className="hero-card-grid">
      <div className="hero-card small"><h3>Lithium-Ion Packs</h3><p>High-density power</p><a href="/shop/li-ion">Explore →</a></div>
      <div className="hero-card small"><h3>LiFePO4 Batteries</h3><p>Safe and long-lasting</p><a href="/shop/lifepo4">Explore →</a></div>
      <div className="hero-card small"><h3>BMS Systems</h3><p>Protect your investment</p><a href="/shop/bms">Explore →</a></div>
      <div className="hero-card small"><h3>Accessories</h3><p>Wires, Connectors & More</p><a href="/shop/accessories">Explore →</a></div>
    </div>
  </section>
);

export default HeroSection;