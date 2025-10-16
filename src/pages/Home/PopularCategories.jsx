import React from "react";

const PopularCategories = ({ popularCategories }) => (
  <section className="page-section section-reveal">
    <h2 className="section-title">Popular Categories</h2>
    <div className="category-grid">
      {popularCategories.map((category) => (
        <div key={category.name} className="category-card">
          <img src={category.image} alt={category.name} />
          <h3>{category.name}</h3>
        </div>
      ))}
    </div>
  </section>
);

export default PopularCategories;