// src/pages/Admin/AdminProductsPage.jsx
import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await adminService.getProducts();
      // depending on backend, data might be { products: [...] } or [...]
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <div className="admin-page-header">
        <h2>Products</h2>
        {/* later: add "Add Product" button to open a form */}
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type / Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.product_id || p._id}>
              <td>{p.product_id || p._id}</td>
              <td>{p.name}</td>
              <td>{p.technical_specs?.product_type || p.category_name}</td>
              <td>
                {p.inventory?.current_price
                  ? `₹${p.inventory.current_price}`
                  : "-"}
              </td>
              <td>{p.inventory?.stock_level ?? "-"}</td>
              <td>{p.status || "Active"}</td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6}>No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProductsPage;
