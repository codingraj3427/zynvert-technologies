// src/pages/Admin/AdminDashboardPage.jsx
import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";

const AdminDashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [overviewRes, topProductsRes] = await Promise.all([
        adminService.getOverview(),
        adminService.getTopProducts({ limit: 5 }),
      ]);

      setOverview(overviewRes);
      setTopProducts(topProductsRes.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  const { revenue, orders, customers } = overview || {};

  return (
    <div>
      <div className="admin-page-header">
        <h2>Dashboard</h2>
      </div>

      <div className="admin-cards-grid">
        <div className="admin-card">
          <div>Total Revenue</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
            ₹{(revenue?.totalRevenue || 0).toFixed(2)}
          </div>
        </div>

        <div className="admin-card">
          <div>Average Order Value</div>
          <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
            ₹{(revenue?.averageOrderValue || 0).toFixed(2)}
          </div>
        </div>

        <div className="admin-card">
          <div>Orders (Paid / Total)</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
            {orders?.paidOrders || 0} / {orders?.totalOrders || 0}
          </div>
        </div>

        <div className="admin-card">
          <div>Customers (New in range)</div>
          <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>
            {customers?.totalCustomers || 0} total
          </div>
          <div style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            {customers?.newCustomersInRange || 0} new in period
          </div>
        </div>
      </div>

      <h3 style={{ marginTop: "2rem", marginBottom: "0.5rem" }}>
        Top Products (by revenue)
      </h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Quantity Sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {topProducts.map((p) => (
            <tr key={p.product_id}>
              <td>{p.name || p.product_id}</td>
              <td>{p.sku || "-"}</td>
              <td>{p.totalQuantity}</td>
              <td>₹{p.totalRevenue.toFixed(2)}</td>
            </tr>
          ))}
          {topProducts.length === 0 && (
            <tr>
              <td colSpan={4}>No products sold in this period.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboardPage;
